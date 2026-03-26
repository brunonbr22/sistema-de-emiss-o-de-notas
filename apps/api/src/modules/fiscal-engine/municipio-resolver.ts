import type { FiscalDecisionInput } from './fiscal-engine.service';

export function resolveMunicipioPrestacao(input: FiscalDecisionInput) {
  if (input.invoiceType !== 'NFSE') return undefined;
  return input.serviceCity ?? input.companyCity;
}
