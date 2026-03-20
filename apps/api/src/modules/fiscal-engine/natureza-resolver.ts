import type { InvoiceDocumentType } from './fiscal-engine.service';

export function resolveNatureza(invoiceType: InvoiceDocumentType) {
  return invoiceType === 'NFSE' ? 'Prestação de serviços' : 'Venda de mercadoria';
}
