/**
 * Alíquotas de ISS por código IBGE do município.
 * Fonte: legislações municipais compiladas (principais capitais e municípios).
 * A alíquota padrão quando o município não está mapeado é 2% (mínimo constitucional).
 *
 * retentionThreshold: valor mínimo da nota para retenção obrigatória pelo tomador.
 * null = o município não exige retenção na fonte.
 */
export interface IssRate {
  ibgeCode: string;
  city: string;
  state: string;
  rate: number;           // decimal: 0.02 = 2%
  retentionThreshold: number | null;
}

export const ISS_RATES: IssRate[] = [
  // ── Capitais ──────────────────────────────────────────────
  { ibgeCode: '3550308', city: 'São Paulo',          state: 'SP', rate: 0.05, retentionThreshold: 0 },
  { ibgeCode: '3304557', city: 'Rio de Janeiro',     state: 'RJ', rate: 0.05, retentionThreshold: 0 },
  { ibgeCode: '3106200', city: 'Belo Horizonte',     state: 'MG', rate: 0.05, retentionThreshold: 0 },
  { ibgeCode: '2927408', city: 'Salvador',           state: 'BA', rate: 0.05, retentionThreshold: 0 },
  { ibgeCode: '4106902', city: 'Curitiba',           state: 'PR', rate: 0.05, retentionThreshold: 0 },
  { ibgeCode: '2611606', city: 'Recife',             state: 'PE', rate: 0.05, retentionThreshold: 0 },
  { ibgeCode: '1302603', city: 'Manaus',             state: 'AM', rate: 0.02, retentionThreshold: null },
  { ibgeCode: '5300108', city: 'Brasília',           state: 'DF', rate: 0.05, retentionThreshold: 0 },
  { ibgeCode: '4314902', city: 'Porto Alegre',       state: 'RS', rate: 0.05, retentionThreshold: 0 },
  { ibgeCode: '2211001', city: 'Teresina',           state: 'PI', rate: 0.05, retentionThreshold: null },
  { ibgeCode: '2304400', city: 'Fortaleza',          state: 'CE', rate: 0.05, retentionThreshold: 0 },
  { ibgeCode: '1501402', city: 'Belém',              state: 'PA', rate: 0.05, retentionThreshold: null },
  { ibgeCode: '5208707', city: 'Goiânia',            state: 'GO', rate: 0.05, retentionThreshold: 0 },
  { ibgeCode: '4205407', city: 'Florianópolis',      state: 'SC', rate: 0.05, retentionThreshold: 0 },
  { ibgeCode: '2800308', city: 'Aracaju',            state: 'SE', rate: 0.05, retentionThreshold: null },
  { ibgeCode: '5002704', city: 'Campo Grande',       state: 'MS', rate: 0.05, retentionThreshold: null },
  { ibgeCode: '5103403', city: 'Cuiabá',             state: 'MT', rate: 0.05, retentionThreshold: null },
  { ibgeCode: '1100205', city: 'Porto Velho',        state: 'RO', rate: 0.02, retentionThreshold: null },
  { ibgeCode: '1400100', city: 'Boa Vista',          state: 'RR', rate: 0.02, retentionThreshold: null },
  { ibgeCode: '1600303', city: 'Macapá',             state: 'AP', rate: 0.02, retentionThreshold: null },
  { ibgeCode: '1721000', city: 'Palmas',             state: 'TO', rate: 0.02, retentionThreshold: null },
  { ibgeCode: '2100055', city: 'São Luís',           state: 'MA', rate: 0.05, retentionThreshold: null },
  { ibgeCode: '2408102', city: 'Natal',              state: 'RN', rate: 0.05, retentionThreshold: null },
  { ibgeCode: '2507507', city: 'João Pessoa',        state: 'PB', rate: 0.05, retentionThreshold: null },
  { ibgeCode: '2704302', city: 'Maceió',             state: 'AL', rate: 0.05, retentionThreshold: null },
  { ibgeCode: '3205309', city: 'Vitória',            state: 'ES', rate: 0.05, retentionThreshold: 0 },
  { ibgeCode: '6922',    city: 'Rio Branco',         state: 'AC', rate: 0.02, retentionThreshold: null },

  // ── Grandes cidades ────────────────────────────────────────
  { ibgeCode: '3509502', city: 'Campinas',           state: 'SP', rate: 0.02, retentionThreshold: 0 },
  { ibgeCode: '3548708', city: 'Santo André',        state: 'SP', rate: 0.05, retentionThreshold: 0 },
  { ibgeCode: '3547809', city: 'Santos',             state: 'SP', rate: 0.05, retentionThreshold: 0 },
  { ibgeCode: '3518800', city: 'Guarulhos',          state: 'SP', rate: 0.05, retentionThreshold: 0 },
  { ibgeCode: '3529401', city: 'Osasco',             state: 'SP', rate: 0.02, retentionThreshold: null },
  { ibgeCode: '3543402', city: 'Ribeirão Preto',     state: 'SP', rate: 0.05, retentionThreshold: 0 },
  { ibgeCode: '3552205', city: 'São Bernardo do Campo', state: 'SP', rate: 0.05, retentionThreshold: 0 },
  { ibgeCode: '3301009', city: 'Niterói',            state: 'RJ', rate: 0.05, retentionThreshold: 0 },
  { ibgeCode: '4119905', city: 'Londrina',           state: 'PR', rate: 0.05, retentionThreshold: null },
  { ibgeCode: '4115200', city: 'Maringá',            state: 'PR', rate: 0.05, retentionThreshold: null },
  { ibgeCode: '4202404', city: 'Blumenau',           state: 'SC', rate: 0.02, retentionThreshold: null },
  { ibgeCode: '4216702', city: 'São José',           state: 'SC', rate: 0.02, retentionThreshold: null },
  { ibgeCode: '4309209', city: 'Caxias do Sul',      state: 'RS', rate: 0.02, retentionThreshold: null },
];

export const DEFAULT_ISS_RATE = 0.02; // 2% — mínimo constitucional

export function getIssRate(ibgeCode: string): IssRate {
  const found = ISS_RATES.find((r) => r.ibgeCode === ibgeCode);
  if (found) return found;
  return {
    ibgeCode,
    city: 'Município não mapeado',
    state: '',
    rate: DEFAULT_ISS_RATE,
    retentionThreshold: null,
  };
}
