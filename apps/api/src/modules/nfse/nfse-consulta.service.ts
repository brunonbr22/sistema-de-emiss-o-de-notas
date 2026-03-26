import { Injectable } from '@nestjs/common';

@Injectable()
export class NfseConsultaService {
  async getStatus(reference: string) {
    return {
      reference,
      status: 'AUTHORIZED',
      accessKey: `NFSE${reference}`,
      protocol: `NFSE-PROTO-${reference}`,
      xml: `<nfse><reference>${reference}</reference></nfse>`,
    };
  }
}
