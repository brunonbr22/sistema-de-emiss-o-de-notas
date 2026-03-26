import { Injectable } from '@nestjs/common';
import { AssinaturaNfseService } from './assinatura-nfse.service';
import { mapToNfsePayload } from './nfse.mapper';

@Injectable()
export class NfseService {
  constructor(private readonly assinaturaService: AssinaturaNfseService) {}

  async sendInvoice(input: { invoiceId: string; customerName: string; customerTaxId: string; serviceCity: string; totalAmount: number; itemDescription: string; }) {
    const payload = mapToNfsePayload(input);
    const signed = this.assinaturaService.sign(payload);

    return {
      gateway: 'NFS-e padrão nacional',
      payload,
      signed,
      status: 'PROCESSING',
      reference: `nfse-${input.invoiceId}`,
    };
  }
}
