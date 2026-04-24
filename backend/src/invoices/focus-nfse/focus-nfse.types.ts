export interface FocusNfseEndereco {
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  codigo_municipio?: string;
  uf?: string;
  cep?: string;
}

export interface FocusNfsePrestador {
  cnpj: string;
  inscricao_municipal: string;
  codigo_municipio: string;
}

export interface FocusNfseTomador {
  cnpj?: string;
  cpf?: string;
  razao_social: string;
  email?: string;
  endereco?: FocusNfseEndereco;
}

export interface FocusNfseServico {
  valor_servicos: string;
  valor_deducoes?: string;
  valor_pis?: string;
  valor_cofins?: string;
  valor_inss?: string;
  valor_ir?: string;
  valor_csll?: string;
  /** 1 = ISS retido na fonte, 2 = não retido */
  iss_retido: '1' | '2';
  responsavel_retencao?: '1' | '2';
  valor_iss?: string;
  base_calculo?: string;
  aliquota?: string;
  valor_liquido_nfse?: string;
  codigo_municipio: string;
  item_lista_servico: string;
  codigo_tributacao_municipio?: string;
  descricao: string;
  codigo_cnae?: string;
  informacoes_adicionais?: string;
}

export interface FocusNfsePayload {
  data_emissao?: string;
  prestador: FocusNfsePrestador;
  tomador: FocusNfseTomador;
  servico: FocusNfseServico;
}

export interface FocusNfseResponse {
  status:
    | 'autorizado'
    | 'processando_autorizacao'
    | 'erro_autorizacao'
    | 'cancelado';
  status_sefaz?: string;
  mensagem_sefaz?: string;
  numero?: string;
  numero_rps?: string;
  serie_rps?: string;
  codigo_verificacao?: string;
  caminho_xml_nota_fiscal?: string;
  caminho_pdf?: string;
  erros?: Array<{ codigo: string; mensagem: string }>;
}

/** Dados salvos em NfseConfig.config (JSON) */
export interface NfseConfigData {
  inscricaoMunicipal: string;
  itemListaServico: string;
  codigoTributacaoMunicipio?: string;
}
