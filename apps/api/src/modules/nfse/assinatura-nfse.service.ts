import { Injectable } from '@nestjs/common';

@Injectable()
export class AssinaturaNfseService {
  sign(payload: unknown) {
    return { signedPayload: payload, signature: 'mock-signature' };
  }
}
