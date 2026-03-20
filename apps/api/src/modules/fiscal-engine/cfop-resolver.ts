import type { FiscalDecisionInput } from './fiscal-engine.service';

export function resolveCfop(input: FiscalDecisionInput) {
  if (input.invoiceType === 'NFSE') return undefined;
  return input.companyState === input.customerState ? '5102' : '6102';
}
