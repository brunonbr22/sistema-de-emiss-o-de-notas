import { Injectable } from '@nestjs/common';
import { classifyCnae, type ActivityKind } from './cnae-classifier';
import { resolveCfop } from './cfop-resolver';
import { getMeiFiscalNotes, getMinimalFiscalValidations } from './mei-rules';
import { resolveMunicipioPrestacao } from './municipio-resolver';
import { resolveNatureza } from './natureza-resolver';

export type InvoiceDocumentType = 'NFE' | 'NFSE';
export type WizardOperationType = 'COMMERCE' | 'SERVICE';

export type FiscalDecisionInput = {
  cnae?: string;
  companyActivityProfile?: ActivityKind;
  wizardOperationType?: WizardOperationType;
  companyState: string;
  customerState: string;
  companyCity: string;
  serviceCity?: string;
  customerTaxId: string;
  totalAmount: number;
  invoiceType: InvoiceDocumentType;
};

@Injectable()
export class FiscalEngineService {
  evaluate(input: Omit<FiscalDecisionInput, 'invoiceType'>) {
    const activityProfile = classifyCnae(input.cnae, input.companyActivityProfile);
    const invoiceType = this.resolveInvoiceType(activityProfile, input.wizardOperationType);

    const decision: FiscalDecisionInput = { ...input, invoiceType };
    const validations = getMinimalFiscalValidations({
      invoiceType,
      customerTaxId: input.customerTaxId,
      totalAmount: input.totalAmount,
      serviceCity: resolveMunicipioPrestacao({ ...decision, serviceCity: input.serviceCity }),
    });

    return {
      mei: true,
      activityProfile,
      invoiceType,
      naturezaOperacao: resolveNatureza(invoiceType),
      cfop: resolveCfop(decision),
      municipioPrestacao: resolveMunicipioPrestacao(decision),
      observations: getMeiFiscalNotes(invoiceType),
      validations,
      isValid: validations.length === 0,
    };
  }

  private resolveInvoiceType(activityProfile: ActivityKind, wizardOperationType?: WizardOperationType): InvoiceDocumentType {
    if (activityProfile === 'SERVICE') return 'NFSE';
    if (activityProfile === 'COMMERCE') return 'NFE';
    return wizardOperationType === 'COMMERCE' ? 'NFE' : 'NFSE';
  }
}
