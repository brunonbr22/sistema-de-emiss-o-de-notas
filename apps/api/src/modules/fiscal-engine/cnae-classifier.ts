export type ActivityKind = 'COMMERCE' | 'SERVICE' | 'BOTH';

const SERVICE_PREFIXES = ['62', '63', '69', '70', '73', '74', '82', '85', '86', '95'];
const COMMERCE_PREFIXES = ['45', '46', '47'];

export function classifyCnae(cnae?: string, fallback?: ActivityKind): ActivityKind {
  const normalized = (cnae ?? '').replace(/\D/g, '');
  const prefix = normalized.slice(0, 2);

  if (SERVICE_PREFIXES.includes(prefix)) return 'SERVICE';
  if (COMMERCE_PREFIXES.includes(prefix)) return 'COMMERCE';
  return fallback ?? 'BOTH';
}
