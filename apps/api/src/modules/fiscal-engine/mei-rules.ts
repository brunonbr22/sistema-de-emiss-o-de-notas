import type { InvoiceDocumentType } from './fiscal-engine.service';

export function getMeiFiscalNotes(invoiceType: InvoiceDocumentType) {
  return {
    highlightTaxes: false,
    defaultObservation: invoiceType === 'NFSE'
      ? 'MEI optante pelo Simples Nacional. Não há destaque de tributos federais, estaduais ou municipais no documento.'
      : 'MEI optante pelo Simples Nacional. Documento emitido sem destaque de tributos.',
  };
}

export function getMinimalFiscalValidations(input: {
  invoiceType: InvoiceDocumentType;
  customerTaxId: string;
  totalAmount: number;
  serviceCity?: string;
}) {
  const errors: string[] = [];

  if (input.customerTaxId.replace(/\D/g, '').length < 11) {
    errors.push('CPF/CNPJ do cliente precisa ter ao menos 11 dígitos.');
  }

  if (input.totalAmount <= 0) {
    errors.push('Valor da nota deve ser maior que zero.');
  }

  if (input.invoiceType === 'NFSE' && !input.serviceCity) {
    errors.push('Município da prestação é obrigatório para NFS-e.');
  }

  return errors;
}
