export interface FiscalCheckResult {
  invoiceType: 'NFE' | 'NFSE';
  cnaeAllowed: boolean;
  cnaeDescription: string;
  grossValue: number;
  issRate: number;
  issValue: number;
  netValue: number;
  retentionRequired: boolean;
  annualIssued: number;
  annualRemaining: number;
  limitWarning: boolean;
  limitExceeded: boolean;
  ibgeCode: string | null;
  city: string | null;
}

export interface Invoice {
  id: string;
  companyId: string;
  type: 'NFE' | 'NFSE';
  status: 'DRAFT' | 'PENDING' | 'ISSUED' | 'REJECTED' | 'CANCELED';
  number: string | null;
  takerDocument: string;
  takerName: string;
  takerEmail: string | null;
  grossValue: string;
  netValue: string;
  issRate: string;
  issValue: string;
  serviceDesc: string;
  cnaeCode: string | null;
  externalRef: string | null;
  accessKey: string | null;
  issuedAt: string | null;
  createdAt: string;
}

export interface FocusNfeStatus {
  status: string;
  numero?: string;
  chave_nfe?: string;
  codigo_verificacao?: string;
  caminho_danfe?: string;
  caminho_xml_nota_fiscal?: string;
  caminho_pdf?: string;
  erros?: Array<{ codigo: string; mensagem: string }>;
}

export interface EmitResponse {
  invoice: Invoice;
  focusNfe?: FocusNfeStatus;
  focusNfse?: FocusNfeStatus;
}

export interface NfseConfig {
  id: string;
  ibgeCode: string;
  provider: string;
  config: {
    inscricaoMunicipal: string;
    itemListaServico: string;
    codigoTributacaoMunicipio?: string;
  };
}

/** Dados acumulados pelo wizard */
export interface WizardData {
  // Step 1 — fiscal
  cnaeCode: string;
  grossValue: number;
  ibgeCode: string;
  invoiceType: 'NFE' | 'NFSE';
  fiscalResult: FiscalCheckResult;

  // Step 2 — tomador
  takerDocument: string;
  takerName: string;
  takerEmail: string;
  takerLogradouro: string;
  takerNumero: string;
  takerComplemento: string;
  takerBairro: string;
  takerMunicipio: string;
  takerUf: string;
  takerCep: string;
  takerCodigoMunicipio: string;

  // Step 3 — serviço
  serviceDesc: string;
  cfop: string;
  naturezaOperacao: string;
  inscricaoMunicipal: string;
  itemListaServico: string;
  codigoTributacaoMunicipio: string;
  informacoesAdicionais: string;
}
