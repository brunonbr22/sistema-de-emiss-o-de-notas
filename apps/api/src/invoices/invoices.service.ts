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
    const operationType = input.operationType === 'COMMERCE' ? 'COMMERCE' : 'SERVICE';

    return {
      type,
      meiMode: true,
      operationType,
      suggestions: {
        naturezaOperacao: operationType === 'COMMERCE' ? 'Venda de mercadoria por MEI' : 'Prestação de serviço por MEI',
        cfop: type === 'NFE' ? '5102' : undefined,
        serviceCode: type === 'NFSE' ? '17.02' : undefined,
        issRetention: false,
        simplifiedCopy: 'Nós traduzimos as regras fiscais para você revisar apenas cliente, item, valor e resumo.',
      },
      requiredSteps: ['destinatario', 'item-e-operacao', 'revisao', 'emitir-agora'],
    };
  }

  async create(input: {
    companyId: string;
    type: 'NFE' | 'NFSE';
    customerName: string;
    customerTaxId: string;
    operationType: 'COMMERCE' | 'SERVICE';
    itemDescription: string;
    serviceCity?: string;
    totalAmount: number;
    payload: Record<string, unknown>;
  }) {
    const invoice = await this.prisma.invoice.create({
      data: {
        companyId: input.companyId,
        type: input.type,
        customerName: input.customerName,
        customerTaxId: input.customerTaxId,
        serviceCity: input.serviceCity,
        totalAmount: new Prisma.Decimal(input.totalAmount),
        payload: {
          ...input.payload,
          operationType: input.operationType,
          itemDescription: input.itemDescription,
        },
        status: 'QUEUED',
      },
    });

    const xml = [
      '<nota>',
      `<id>${invoice.id}</id>`,
      `<tipo>${invoice.type}</tipo>`,
      `<operacao>${input.operationType}</operacao>`,
      `<cliente>${input.customerName}</cliente>`,
      `<documento>${input.customerTaxId}</documento>`,
      `<descricao>${input.itemDescription}</descricao>`,
      `<valor>${input.totalAmount.toFixed(2)}</valor>`,
      '</nota>',
    ].join('');

    const { url } = await this.storage.saveXml(`invoices/${invoice.id}.xml`, xml);

    const updatedInvoice = await this.prisma.invoice.update({
      where: { id: invoice.id },
      data: { xmlUrl: url, status: 'AUTHORIZED', externalRef: `focus-${invoice.id}` },
    });

    await this.queue.enqueue('issue-invoice', { invoiceId: invoice.id, type: invoice.type });
    await this.audit.log({
      action: 'invoice.created',
      entity: 'invoice',
      entityId: invoice.id,
      metadata: {
        companyId: input.companyId,
        type: input.type,
        customerName: input.customerName,
        xmlUrl: url,
      },
    });

    return {
      ...updatedInvoice,
      history: [
        { label: 'Nota criada', status: 'completed' },
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
