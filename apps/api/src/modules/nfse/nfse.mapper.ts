import { buildRps } from './rps.builder';

export function mapToNfsePayload(input: { invoiceId: string; customerName: string; customerTaxId: string; serviceCity: string; totalAmount: number; itemDescription: string; }) {
  return {
    ambiente: 'homologacao',
    rps: buildRps(input),
  };
}
