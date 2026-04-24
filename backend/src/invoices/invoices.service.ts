import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { FiscalService } from '../fiscal/fiscal.service';
import { StorageService } from '../storage/storage.service';
import { FocusNfeService } from './focus-nfe/focus-nfe.service';
import { FocusNfseService } from './focus-nfse/focus-nfse.service';
import { FocusNfePayload } from './focus-nfe/focus-nfe.types';
import { FocusNfsePayload, NfseConfigData } from './focus-nfse/focus-nfse.types';
import { EmitNfeDto } from './dto/emit-nfe.dto';
import { EmitNfseDto } from './dto/emit-nfse.dto';
import { CancelNfeDto } from './dto/cancel-nfe.dto';
import { UpsertNfseConfigDto } from './dto/upsert-nfse-config.dto';
import { Company } from '@prisma/client';

@Injectable()
export class InvoicesService {
  private readonly logger = new Logger(InvoicesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly fiscal: FiscalService,
    private readonly storage: StorageService,
    private readonly focusNfe: FocusNfeService,
    private readonly focusNfse: FocusNfseService,
  ) {}

  // ─── NF-e ─────────────────────────────────────────────────────────────────

  async emitNfe(companyId: string, userId: string, dto: EmitNfeDto) {
    const company = await this.assertMember(companyId, userId);
    this.assertPlanActive(company);

    const fiscalResult = await this.fiscal.check(companyId, {
      cnaeCode: dto.cnaeCode,
      grossValue: dto.grossValue.toFixed(2),
    });

    if (fiscalResult.invoiceType !== 'NFE') {
      throw new BadRequestException(
        `O CNAE ${dto.cnaeCode} exige emissão de NFS-e, não NF-e.`,
      );
    }
    if (fiscalResult.limitExceeded) {
      throw new BadRequestException('Limite anual MEI excedido. Não é possível emitir mais notas.');
    }

    const ref = `nfe-${companyId}-${uuidv4()}`;
    const isHom = this.focusNfe.isHomologacao();
    const token = this.focusNfe.getToken(company.focusNfeToken);
    const payload = this.buildNfePayload(company, dto);

    const invoice = await this.prisma.invoice.create({
      data: {
        companyId,
        type: 'NFE',
        status: 'PENDING',
        takerDocument: dto.takerDocument,
        takerName: dto.takerName,
        takerEmail: dto.takerEmail,
        serviceDesc: dto.serviceDesc,
        cnaeCode: dto.cnaeCode,
        grossValue: dto.grossValue,
        deductions: 0,
        netValue: dto.grossValue,
        issRate: 0,
        issValue: 0,
        externalRef: ref,
      },
    });

    try {
      const focusResponse = await this.focusNfe.emitir(ref, payload, token, isHom);
      const issued = focusResponse.status === 'autorizado';

      let xmlPath: string | null = null;
      if (issued) {
        xmlPath = await this.cacheXml('nfe', companyId, invoice.id, ref, token, isHom);
      }

      const updated = await this.prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          status: issued ? 'ISSUED' : 'PENDING',
          number: focusResponse.numero ?? null,
          accessKey: focusResponse.chave_nfe ?? null,
          externalId: focusResponse.chave_nfe ?? null,
          issuedAt: issued ? new Date() : null,
          xmlPath,
        },
      });
      return { invoice: updated, focusNfe: focusResponse };
    } catch (err) {
      await this.prisma.invoice.update({ where: { id: invoice.id }, data: { status: 'REJECTED' } });
      throw err;
    }
  }

  // ─── NFS-e ────────────────────────────────────────────────────────────────

  async emitNfse(companyId: string, userId: string, dto: EmitNfseDto) {
    const company = await this.assertMember(companyId, userId);
    this.assertPlanActive(company);

    const fiscalResult = await this.fiscal.check(companyId, {
      cnaeCode: dto.cnaeCode,
      grossValue: dto.grossValue.toFixed(2),
      ibgeCode: dto.ibgeCode,
    });

    if (fiscalResult.invoiceType !== 'NFSE') {
      throw new BadRequestException(
        `O CNAE ${dto.cnaeCode} exige emissão de NF-e, não NFS-e.`,
      );
    }
    if (fiscalResult.limitExceeded) {
      throw new BadRequestException('Limite anual MEI excedido. Não é possível emitir mais notas.');
    }

    const nfseConfig = await this.getNfseConfigOrThrow(companyId, dto.ibgeCode);

    const ref = `nfse-${companyId}-${uuidv4()}`;
    const isHom = this.focusNfse.isHomologacao();
    const token = this.focusNfse.getToken(company.focusNfeToken);

    const issValue = this.round2(dto.grossValue * fiscalResult.issRate);
    const netValue = this.round2(dto.grossValue - issValue);

    const payload = this.buildNfsePayload(company, dto, nfseConfig, fiscalResult.issRate, issValue, netValue);

    const invoice = await this.prisma.invoice.create({
      data: {
        companyId,
        type: 'NFSE',
        status: 'PENDING',
        takerDocument: dto.takerDocument,
        takerName: dto.takerName,
        takerEmail: dto.takerEmail,
        serviceDesc: dto.serviceDesc,
        cnaeCode: dto.cnaeCode,
        grossValue: dto.grossValue,
        deductions: 0,
        netValue,
        issRate: fiscalResult.issRate,
        issValue,
        externalRef: ref,
      },
    });

    try {
      const focusResponse = await this.focusNfse.emitir(ref, payload, token, isHom);
      const issued = focusResponse.status === 'autorizado';

      let xmlPath: string | null = null;
      if (issued) {
        xmlPath = await this.cacheXml('nfse', companyId, invoice.id, ref, token, isHom);
      }

      const updated = await this.prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          status: issued ? 'ISSUED' : 'PENDING',
          number: focusResponse.numero ?? null,
          accessKey: focusResponse.codigo_verificacao ?? null,
          externalId: focusResponse.numero ?? null,
          issuedAt: issued ? new Date() : null,
          xmlPath,
        },
      });
      return { invoice: updated, focusNfse: focusResponse };
    } catch (err) {
      await this.prisma.invoice.update({ where: { id: invoice.id }, data: { status: 'REJECTED' } });
      throw err;
    }
  }

  async cancelNfse(invoiceId: string, userId: string, dto: CancelNfeDto) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { company: true },
    });
    if (!invoice) throw new NotFoundException('Nota fiscal não encontrada.');
    if (invoice.type !== 'NFSE') throw new BadRequestException('Esta nota não é uma NFS-e.');

    await this.assertMember(invoice.companyId, userId);

    if (invoice.status !== 'ISSUED') {
      throw new BadRequestException('Somente notas autorizadas podem ser canceladas.');
    }
    if (!invoice.externalRef) {
      throw new BadRequestException('Referência externa não encontrada para esta nota.');
    }

    const isHom = this.focusNfse.isHomologacao();
    const token = this.focusNfse.getToken(invoice.company.focusNfeToken);
    const focusResponse = await this.focusNfse.cancelar(
      invoice.externalRef,
      dto.justificativa,
      token,
      isHom,
    );

    const updated = await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: 'CANCELED', canceledAt: new Date() },
    });

    return { invoice: updated, focusNfse: focusResponse };
  }

  async getNfseStatus(invoiceId: string, userId: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { company: true },
    });
    if (!invoice) throw new NotFoundException('Nota fiscal não encontrada.');
    if (invoice.type !== 'NFSE') throw new BadRequestException('Esta nota não é uma NFS-e.');

    await this.assertMember(invoice.companyId, userId);

    if (!invoice.externalRef) return { invoice };

    const isHom = this.focusNfse.isHomologacao();
    const token = this.focusNfse.getToken(invoice.company.focusNfeToken);
    const focusResponse = await this.focusNfse.consultar(invoice.externalRef, token, isHom);

    if (focusResponse.status === 'autorizado' && invoice.status !== 'ISSUED') {
      await this.prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          status: 'ISSUED',
          number: focusResponse.numero ?? null,
          accessKey: focusResponse.codigo_verificacao ?? null,
          externalId: focusResponse.numero ?? null,
          issuedAt: new Date(),
        },
      });
    }

    return { invoice, focusNfse: focusResponse };
  }

  async downloadNfseXml(invoiceId: string, userId: string): Promise<Buffer> {
    const invoice = await this.findInvoiceWithAccess(invoiceId, userId, 'NFSE');
    if (invoice.xmlPath) {
      const cached = await this.storage.get(invoice.xmlPath);
      if (cached) return cached;
    }
    const isHom = this.focusNfse.isHomologacao();
    const token = this.focusNfse.getToken(invoice.company.focusNfeToken);
    const buf = await this.focusNfse.downloadXml(invoice.externalRef!, token, isHom);
    await this.saveAndPersistXml(invoice.id, invoice.companyId, 'nfse', buf);
    return buf;
  }

  async downloadNfsePdf(invoiceId: string, userId: string): Promise<Buffer> {
    const invoice = await this.findInvoiceWithAccess(invoiceId, userId, 'NFSE');
    if (invoice.xmlPath) {
      const cached = await this.storage.get(this.storage.pdfPath(invoice.xmlPath));
      if (cached) return cached;
    }
    const isHom = this.focusNfse.isHomologacao();
    const token = this.focusNfse.getToken(invoice.company.focusNfeToken);
    const buf = await this.focusNfse.downloadPdf(invoice.externalRef!, token, isHom);
    if (invoice.xmlPath) {
      await this.storage.save(this.storage.pdfPath(invoice.xmlPath), buf).catch(() => {});
    }
    return buf;
  }

  async listNfseByCompany(companyId: string, userId: string) {
    await this.assertMember(companyId, userId);
    return this.prisma.invoice.findMany({
      where: { companyId, type: 'NFSE' },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── NFS-e Config ─────────────────────────────────────────────────────────

  async upsertNfseConfig(companyId: string, userId: string, dto: UpsertNfseConfigDto) {
    await this.assertMember(companyId, userId);

    const configData: NfseConfigData = {
      inscricaoMunicipal: dto.inscricaoMunicipal,
      itemListaServico: dto.itemListaServico,
      codigoTributacaoMunicipio: dto.codigoTributacaoMunicipio,
    };

    return this.prisma.nfseConfig.upsert({
      where: { companyId_ibgeCode: { companyId, ibgeCode: dto.ibgeCode } },
      update: { config: configData as any, provider: 'focus-nfe' },
      create: {
        companyId,
        ibgeCode: dto.ibgeCode,
        provider: 'focus-nfe',
        config: configData as any,
      },
    });
  }

  async listNfseConfigs(companyId: string, userId: string) {
    await this.assertMember(companyId, userId);
    return this.prisma.nfseConfig.findMany({ where: { companyId } });
  }

  // ─── NF-e shared methods ───────────────────────────────────────────────────

  async getStatus(invoiceId: string, userId: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { company: true },
    });
    if (!invoice) throw new NotFoundException('Nota fiscal não encontrada.');
    await this.assertMember(invoice.companyId, userId);
    if (!invoice.externalRef) return { invoice };

    const isHom = this.focusNfe.isHomologacao();
    const token = this.focusNfe.getToken(invoice.company.focusNfeToken);
    const focusResponse = await this.focusNfe.consultar(invoice.externalRef, token, isHom);

    if (focusResponse.status === 'autorizado' && invoice.status !== 'ISSUED') {
      await this.prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          status: 'ISSUED',
          number: focusResponse.numero ?? null,
          accessKey: focusResponse.chave_nfe ?? null,
          externalId: focusResponse.chave_nfe ?? null,
          issuedAt: new Date(),
        },
      });
    }

    return { invoice, focusNfe: focusResponse };
  }

  async cancel(invoiceId: string, userId: string, dto: CancelNfeDto) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { company: true },
    });
    if (!invoice) throw new NotFoundException('Nota fiscal não encontrada.');
    if (invoice.type !== 'NFE') throw new BadRequestException('Use /nfse/:id/cancel para NFS-e.');

    await this.assertMember(invoice.companyId, userId);

    if (invoice.status !== 'ISSUED') {
      throw new BadRequestException('Somente notas autorizadas podem ser canceladas.');
    }
    if (!invoice.externalRef) {
      throw new BadRequestException('Referência externa não encontrada para esta nota.');
    }

    const isHom = this.focusNfe.isHomologacao();
    const token = this.focusNfe.getToken(invoice.company.focusNfeToken);
    const focusResponse = await this.focusNfe.cancelar(invoice.externalRef, dto.justificativa, token, isHom);

    const updated = await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: 'CANCELED', canceledAt: new Date() },
    });

    return { invoice: updated, focusNfe: focusResponse };
  }

  async downloadXml(invoiceId: string, userId: string): Promise<Buffer> {
    const invoice = await this.findInvoiceWithAccess(invoiceId, userId, 'NFE');
    if (invoice.xmlPath) {
      const cached = await this.storage.get(invoice.xmlPath);
      if (cached) return cached;
    }
    const isHom = this.focusNfe.isHomologacao();
    const token = this.focusNfe.getToken(invoice.company.focusNfeToken);
    const buf = await this.focusNfe.downloadXml(invoice.externalRef!, token, isHom);
    await this.saveAndPersistXml(invoice.id, invoice.companyId, 'nfe', buf);
    return buf;
  }

  async downloadDanfe(invoiceId: string, userId: string): Promise<Buffer> {
    const invoice = await this.findInvoiceWithAccess(invoiceId, userId, 'NFE');
    if (invoice.xmlPath) {
      const cached = await this.storage.get(this.storage.pdfPath(invoice.xmlPath));
      if (cached) return cached;
    }
    const isHom = this.focusNfe.isHomologacao();
    const token = this.focusNfe.getToken(invoice.company.focusNfeToken);
    const buf = await this.focusNfe.downloadDanfe(invoice.externalRef!, token, isHom);
    if (invoice.xmlPath) {
      await this.storage.save(this.storage.pdfPath(invoice.xmlPath), buf).catch(() => {});
    }
    return buf;
  }

  async listByCompany(companyId: string, userId: string) {
    await this.assertMember(companyId, userId);
    return this.prisma.invoice.findMany({
      where: { companyId, type: 'NFE' },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private assertPlanActive(company: Company): void {
    if (company.planId) return; // assinatura ativa

    const now = new Date();
    const trialOk = company.trialEndsAt && company.trialEndsAt > now;
    if (trialOk) return; // trial vigente

    throw new ForbiddenException(
      'Seu período de trial expirou. Assine um plano para continuar emitindo notas fiscais.',
    );
  }

  private async assertMember(companyId: string, userId: string): Promise<Company> {
    const membership = await this.prisma.companyMember.findUnique({
      where: { userId_companyId: { userId, companyId } },
      include: { company: true },
    });
    if (!membership) throw new NotFoundException('Empresa não encontrada.');
    return membership.company;
  }

  private async findInvoiceWithAccess(invoiceId: string, userId: string, type: 'NFE' | 'NFSE') {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { company: true },
    });
    if (!invoice) throw new NotFoundException('Nota fiscal não encontrada.');
    if (invoice.type !== type) throw new BadRequestException(`Esta nota não é uma ${type}.`);
    await this.assertMember(invoice.companyId, userId);
    if (!invoice.externalRef) throw new BadRequestException('Nota sem referência externa.');
    return invoice;
  }

  private async getNfseConfigOrThrow(companyId: string, ibgeCode: string) {
    const cfg = await this.prisma.nfseConfig.findUnique({
      where: { companyId_ibgeCode: { companyId, ibgeCode } },
    });
    if (!cfg) {
      throw new BadRequestException(
        `Configure os dados NFS-e para o município ${ibgeCode} antes de emitir. ` +
        `Use POST /invoices/nfse-config para cadastrar.`,
      );
    }
    return cfg.config as unknown as NfseConfigData;
  }

  private buildNfePayload(company: Company, dto: EmitNfeDto): FocusNfePayload {
    const value = dto.grossValue.toFixed(2);
    const isCnpj = dto.takerDocument.replace(/\D/g, '').length === 14;

    return {
      natureza_operacao: dto.naturezaOperacao ?? 'Venda de mercadoria',
      tipo_documento: '1',
      local_destino: '1',
      consumidor_final: '1',
      presenca_comprador: '9',
      informacoes_adicionais_contribuinte: dto.informacoesAdicionais,
      emitente: {
        cnpj: company.cnpj.replace(/\D/g, ''),
        nome: company.name,
        logradouro: company.street ?? '',
        numero: company.number ?? 'S/N',
        complemento: company.complement ?? undefined,
        bairro: company.neighborhood ?? '',
        municipio: company.city ?? '',
        uf: company.state ?? '',
        cep: (company.zipCode ?? '').replace(/\D/g, ''),
        regime_tributario: '1',
      },
      destinatario: {
        cnpj_cpf: dto.takerDocument.replace(/\D/g, ''),
        nome: dto.takerName,
        email: dto.takerEmail,
        logradouro: dto.takerAddress?.logradouro,
        numero: dto.takerAddress?.numero,
        bairro: dto.takerAddress?.bairro,
        municipio: dto.takerAddress?.municipio,
        uf: dto.takerAddress?.uf,
        cep: dto.takerAddress?.cep?.replace(/\D/g, ''),
        indicador_ie_destinatario: isCnpj ? '1' : '9',
      },
      itens: [
        {
          numero_item: '1',
          codigo_produto: '1',
          descricao: dto.serviceDesc,
          cfop: dto.cfop,
          unidade_comercial: 'UN',
          quantidade_comercial: '1.00',
          valor_unitario_comercial: value,
          valor_unitario_tributavel: value,
          unidade_tributavel: 'UN',
          quantidade_tributavel: '1.00',
          valor_bruto: value,
          inclui_no_total: '1',
          pis_situacao_tributaria: '07',
          cofins_situacao_tributaria: '07',
        },
      ],
      formas_pagamento: [{ forma_pagamento: '01', valor_pagamento: value }],
    };
  }

  private buildNfsePayload(
    company: Company,
    dto: EmitNfseDto,
    cfg: NfseConfigData,
    issRate: number,
    issValue: number,
    netValue: number,
  ): FocusNfsePayload {
    const gross = dto.grossValue.toFixed(2);
    const doc = dto.takerDocument.replace(/\D/g, '');
    const isCnpj = doc.length === 14;

    return {
      prestador: {
        cnpj: company.cnpj.replace(/\D/g, ''),
        inscricao_municipal: cfg.inscricaoMunicipal,
        codigo_municipio: dto.ibgeCode,
      },
      tomador: {
        ...(isCnpj ? { cnpj: doc } : { cpf: doc }),
        razao_social: dto.takerName,
        email: dto.takerEmail,
        endereco: dto.takerAddress
          ? {
              logradouro: dto.takerAddress.logradouro,
              numero: dto.takerAddress.numero,
              complemento: dto.takerAddress.complemento,
              bairro: dto.takerAddress.bairro,
              codigo_municipio: dto.takerAddress.codigoMunicipio,
              uf: dto.takerAddress.uf,
              cep: dto.takerAddress.cep?.replace(/\D/g, ''),
            }
          : undefined,
      },
      servico: {
        valor_servicos: gross,
        valor_deducoes: '0.00',
        valor_pis: '0.00',
        valor_cofins: '0.00',
        valor_inss: '0.00',
        valor_ir: '0.00',
        valor_csll: '0.00',
        iss_retido: issValue > 0 ? '1' : '2',
        valor_iss: issValue.toFixed(2),
        base_calculo: gross,
        aliquota: issRate.toFixed(4),
        valor_liquido_nfse: netValue.toFixed(2),
        codigo_municipio: dto.ibgeCode,
        item_lista_servico: dto.itemListaServico ?? cfg.itemListaServico,
        codigo_tributacao_municipio:
          dto.codigoTributacaoMunicipio ?? cfg.codigoTributacaoMunicipio,
        descricao: dto.serviceDesc,
        codigo_cnae: dto.cnaeCode.replace(/\D/g, ''),
        informacoes_adicionais: dto.informacoesAdicionais,
      },
    };
  }

  private round2(n: number): number {
    return Math.round(n * 100) / 100;
  }

  // ─── Storage helpers ───────────────────────────────────────────────────────

  /** Baixa XML do Focus NFe e persiste no storage; atualiza xmlPath na invoice. */
  private async cacheXml(
    type: 'nfe' | 'nfse',
    companyId: string,
    invoiceId: string,
    ref: string,
    token: string,
    isHom: boolean,
  ): Promise<string | null> {
    try {
      const buf =
        type === 'nfe'
          ? await this.focusNfe.downloadXml(ref, token, isHom)
          : await this.focusNfse.downloadXml(ref, token, isHom);

      const key = this.storage.xmlKey(companyId, invoiceId, type);
      await this.storage.save(key, buf);
      return key;
    } catch (err) {
      this.logger.warn(`Não foi possível cachear XML da ${type.toUpperCase()} ${invoiceId}: ${err}`);
      return null;
    }
  }

  /** Salva buffer XML no storage e grava xmlPath na invoice (chamado no download tardio). */
  private async saveAndPersistXml(
    invoiceId: string,
    companyId: string,
    type: 'nfe' | 'nfse',
    buf: Buffer,
  ): Promise<void> {
    try {
      const key = this.storage.xmlKey(companyId, invoiceId, type);
      await this.storage.save(key, buf);
      await this.prisma.invoice.update({ where: { id: invoiceId }, data: { xmlPath: key } });
    } catch (err) {
      this.logger.warn(`Não foi possível persistir XML ${invoiceId}: ${err}`);
    }
  }
}
