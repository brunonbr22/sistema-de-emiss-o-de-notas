import { Injectable } from '@nestjs/common';

@Injectable()
export class FocusConsultaService {
  async getStatus(reference: string) {
    return {
      reference,
      status: 'AUTHORIZED',
      accessKey: `NFE${reference}`,
      protocol: `PROTO-${reference}`,
      xml: `<xml><reference>${reference}</reference></xml>`,
    };
  }
}
