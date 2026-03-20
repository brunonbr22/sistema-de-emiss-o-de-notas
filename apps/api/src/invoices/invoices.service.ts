import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../common/prisma.service';
import { FiscalEngineService } from '../modules/fiscal-engine/fiscal-engine.service';
import { QueueService } from '../queues/queue.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly storage: StorageService,
    private readonly queue: QueueService,
    private readonly fiscalEngine: FiscalEngineService,
  ) {}

  simulateFiscalEngine(input: {
    operationType: 'COMMERCE' | 'SERVICE';
    companyActivityProfile?: 'COMMERCE' | 'SERVICE' | 'BOTH';
    cnae?: string;
    companyState: string;
    customerState: string;
    companyCity: string;
    serviceCity?: string;
    customerTaxId: string;
    totalAmount: number;
  }) {
    return this.fiscalEngine.evaluate({
      wizardOperationType: input.operationType,
      companyActivityProfile: input.companyActivityProfile,
      cnae: input.cnae,
      companyState: input.companyState,
      customerState: input.customerState,
      companyCity: input.companyCity,
      serviceCity: input.serviceCity,
      customerTaxId: input.customerTaxId,
      totalAmount: input.totalAmount,
    });
  }

  async create(input: {
    companyId: string;
    customerName: string;
    customerTaxId: string;
    operationType: 'COMMERCE' | 'SERVICE';
    itemDescription: string;
    companyActivityProfile?: 'COMMERCE' | 'SERVICE' | 'BOTH';
    cnae?: string;
    companyState: string;
    customerState: string;
    companyCity: string;
    serviceCity?: string;
    totalAmount: number;
    payload: Record<string, unknown>;
  }) {
    const fiscalDecision = this.fiscalEngine.evaluate({
      wizardOperationType: input.operationType,
      companyActivityProfile: input.companyActivityProfile,
      cnae: input.cnae,
      companyState: input.companyState,
      customerState: input.customerState,
      companyCity: input.companyCity,
      serviceCity: input.serviceCity,
      customerTaxId: input.customerTaxId,
      totalAmount: input.totalAmount,
    });

    if (!fiscalDecision.isValid) {
      throw new BadRequestException({ message: 'Falha nas validações fiscais mínimas do MVP.', errors: fiscalDecision.validations });
    }

    const invoice = await this.prisma.invoice.create({
      data: {
        companyId: input.companyId,
        type: fiscalDecision.invoiceType,
        customerName: input.customerName,
        customerTaxId: input.customerTaxId,
        serviceCity: fiscalDecision.municipioPrestacao,
        totalAmount: new Prisma.Decimal(input.totalAmount),
        payload: {
          ...input.payload,
          operationType: input.operationType,
          itemDescription: input.itemDescription,
          fiscalDecision,
        },
        status: 'QUEUED',
      },
    });

    const xml = [
      '<nota>',
      `<id>${invoice.id}</id>`,
      `<tipo>${fiscalDecision.invoiceType}</tipo>`,
      `<natureza>${fiscalDecision.naturezaOperacao}</natureza>`,
      `<cfop>${fiscalDecision.cfop ?? ''}</cfop>`,
      `<municipioPrestacao>${fiscalDecision.municipioPrestacao ?? ''}</municipioPrestacao>`,
      `<cliente>${input.customerName}</cliente>`,
      `<documento>${input.customerTaxId}</documento>`,
      `<descricao>${input.itemDescription}</descricao>`,
      `<valor>${input.totalAmount.toFixed(2)}</valor>`,
      `<observacao>${fiscalDecision.observations.defaultObservation}</observacao>`,
      '</nota>',
    ].join('');

    const { url } = await this.storage.saveXml(`invoices/${invoice.id}.xml`, xml);

    const updatedInvoice = await this.prisma.invoice.update({
      where: { id: invoice.id },
      data: { xmlUrl: url, status: 'AUTHORIZED', externalRef: `focus-${invoice.id}` },
    });

    await this.queue.enqueue('issue-invoice', { invoiceId: invoice.id, type: updatedInvoice.type, fiscalDecision });
    await this.audit.log({
      action: 'invoice.created',
      entity: 'invoice',
      entityId: invoice.id,
      metadata: {
        companyId: input.companyId,
        invoiceType: fiscalDecision.invoiceType,
        naturezaOperacao: fiscalDecision.naturezaOperacao,
        cfop: fiscalDecision.cfop,
        xmlUrl: url,
      },
    });

    return {
      ...updatedInvoice,
      fiscalDecision,
      history: [
        { label: 'Motor fiscal definiu a nota', status: 'completed' },
        { label: 'XML salvo', status: 'completed' },
        { label: 'Status autorizado', status: 'completed' },
      ],
      xmlDownloadUrl: url,
    };
  }

  async listByCompany(companyId: string) {
    const invoices = await this.prisma.invoice.findMany({ where: { companyId }, orderBy: { createdAt: 'desc' } });
    return invoices.map((invoice) => ({
      ...invoice,
      xmlDownloadUrl: invoice.xmlUrl,
      history: [
        { label: 'Nota criada', status: 'completed' },
        { label: 'Autorizada', status: invoice.status === 'AUTHORIZED' ? 'completed' : 'pending' },
      ],
    }));
  }
}
