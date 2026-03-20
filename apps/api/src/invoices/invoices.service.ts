import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../common/prisma.service';
import { QueueService } from '../queues/queue.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly storage: StorageService,
    private readonly queue: QueueService,
  ) {}

  simulateFiscalEngine(input: Record<string, unknown>) {
    const type = input.type === 'NFSE' ? 'NFSE' : 'NFE';
    return {
      type,
      meiMode: true,
      suggestions: {
        naturezaOperacao: type === 'NFE' ? 'Venda de mercadoria por MEI' : 'Prestação de serviço por MEI',
        cfop: type === 'NFE' ? '5102' : undefined,
        serviceCode: type === 'NFSE' ? '17.02' : undefined,
        issRetention: false,
        simplifiedCopy: 'Nós preenchemos o fiscal difícil para você revisar só o essencial.',
      },
      requiredSteps: ['empresa', 'cliente', 'produto-ou-servico', 'resumo'],
    };
  }

  async create(input: { companyId: string; type: 'NFE' | 'NFSE'; customerName: string; customerTaxId: string; serviceCity?: string; totalAmount: number; payload: Record<string, unknown>; }) {
    const invoice = await this.prisma.invoice.create({
      data: {
        companyId: input.companyId,
        type: input.type,
        customerName: input.customerName,
        customerTaxId: input.customerTaxId,
        serviceCity: input.serviceCity,
        totalAmount: new Prisma.Decimal(input.totalAmount),
        payload: input.payload,
        status: 'QUEUED',
      },
    });

    const xml = `<nota><id>${invoice.id}</id><tipo>${invoice.type}</tipo><cliente>${invoice.customerName}</cliente></nota>`;
    const { url } = await this.storage.saveXml(`invoices/${invoice.id}.xml`, xml);

    await this.prisma.invoice.update({ where: { id: invoice.id }, data: { xmlUrl: url, status: 'AUTHORIZED', externalRef: `focus-${invoice.id}` } });
    await this.queue.enqueue('issue-invoice', { invoiceId: invoice.id, type: invoice.type });
    await this.audit.log({ action: 'invoice.created', entity: 'invoice', entityId: invoice.id, metadata: { companyId: input.companyId, type: input.type } });

    return { ...invoice, xmlUrl: url, status: 'AUTHORIZED' };
  }

  listByCompany(companyId: string) {
    return this.prisma.invoice.findMany({ where: { companyId }, orderBy: { createdAt: 'desc' } });
  }
}
