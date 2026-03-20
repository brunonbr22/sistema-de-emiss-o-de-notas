import { Injectable } from '@nestjs/common';
import { mapToFocusPayload } from './focus.mapper';

@Injectable()
export class FocusService {
  async sendInvoice(input: {
    invoiceId: string;
    customerName: string;
    customerTaxId: string;
    naturezaOperacao: string;
    cfop?: string;
    totalAmount: number;
    itemDescription: string;
  }) {
    const payload = mapToFocusPayload(input);
    return {
      gateway: 'Focus NFe',
      payload,
      status: 'PROCESSING',
      reference: `focus-${input.invoiceId}`,
    };
  }
}
