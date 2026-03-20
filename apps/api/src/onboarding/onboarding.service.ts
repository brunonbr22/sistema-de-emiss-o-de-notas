import { Injectable } from '@nestjs/common';

@Injectable()
export class OnboardingService {
  lookupByCnpj(cnpj: string) {
    return {
      cnpj,
      legalName: 'Empresa Exemplo MEI LTDA',
      mainActivity: 'Serviços administrativos',
      city: 'São Paulo',
      state: 'SP',
      taxRegime: 'MEI',
      recommendedInvoiceTypes: ['NF-e', 'NFS-e padrão nacional'],
      fiscalHints: [
        'Vamos sugerir a natureza de operação automaticamente.',
        'Como MEI, o preenchimento foi reduzido ao mínimo viável.',
      ],
    };
  }
}
