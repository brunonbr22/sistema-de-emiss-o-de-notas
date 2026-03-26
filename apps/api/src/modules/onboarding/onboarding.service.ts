import { Injectable } from '@nestjs/common';
import { classifyCnae } from '../fiscal-engine/cnae-classifier';
import { EmpresasService } from '../empresas/empresas.service';
import { CnpjService } from './cnpj.service';

@Injectable()
export class OnboardingService {
  constructor(
    private readonly cnpjService: CnpjService,
    private readonly empresasService: EmpresasService,
  ) {}

  async lookupByCnpj(cnpj: string) {
    const companyData = await this.cnpjService.fetchByCnpj(cnpj);
    const activityProfile = classifyCnae(companyData.cnae_fiscal_principal);

    return {
      cnpj: companyData.cnpj,
      legalName: companyData.razao_social,
      tradeName: companyData.nome_fantasia,
      city: companyData.municipio,
      state: companyData.uf,
      cnae: companyData.cnae_fiscal_principal,
      legalNature: companyData.natureza_juridica,
      activityProfile,
    };
  }

  async createCompanyFromCnpj(input: { userId: string; cnpj: string }) {
    const companyData = await this.lookupByCnpj(input.cnpj);
    return this.empresasService.create({ userId: input.userId, ...companyData });
  }
}
