import { Injectable } from '@nestjs/common';
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class OnboardingService {
  constructor(private readonly companiesService: CompaniesService) {}

  async createCompanyFromCnpj(input: { userId: string; cnpj: string }) {
    const companyData = this.lookupCompanyProfile(input.cnpj);
    return this.companiesService.createFromOnboarding({
      userId: input.userId,
      cnpj: input.cnpj,
      legalName: companyData.legalName,
      tradeName: companyData.tradeName,
      city: companyData.city,
      state: companyData.state,
      cnae: companyData.cnae,
      activityProfile: companyData.activityProfile,
    });
  }

  lookupByCnpj(cnpj: string) {
    const companyData = this.lookupCompanyProfile(cnpj);
    return {
      cnpj,
      ...companyData,
      taxRegime: 'MEI',
      recommendedInvoiceTypes: companyData.activityProfile === 'SERVICE'
        ? ['NFS-e padrão nacional']
        : companyData.activityProfile === 'COMMERCE'
          ? ['NF-e']
          : ['NF-e', 'NFS-e padrão nacional'],
      fiscalHints: [
        'Vamos sugerir automaticamente o tipo de operação ideal para MEI.',
        'Seu período de teste de 14 dias é ativado assim que a empresa é criada.',
      ],
    };
  }

  private lookupCompanyProfile(cnpj: string) {
    const normalized = cnpj.replace(/\D/g, '');
    const lastDigit = Number(normalized.at(-1) ?? '0');

    if (lastDigit % 3 === 0) {
      return {
        legalName: 'Ateliê Criativo da Ana MEI',
        tradeName: 'Ateliê Criativo',
        city: 'Belo Horizonte',
        state: 'MG',
        cnae: '1412-6/01',
        mainActivity: 'Confecção de peças do vestuário sob medida',
        activityProfile: 'COMMERCE' as const,
      };
    }

    if (lastDigit % 2 === 0) {
      return {
        legalName: 'Mariana Soluções Digitais MEI',
        tradeName: 'Mariana Digital',
        city: 'São Paulo',
        state: 'SP',
        cnae: '6201-5/02',
        mainActivity: 'Desenvolvimento de programas de computador sob encomenda',
        activityProfile: 'SERVICE' as const,
      };
    }

    return {
      legalName: 'Casa Verde Comércio e Serviços MEI',
      tradeName: 'Casa Verde',
      city: 'Curitiba',
      state: 'PR',
      cnae: '4754-7/01',
      mainActivity: 'Comércio varejista de móveis',
      activityProfile: 'BOTH' as const,
    };
  }
}
