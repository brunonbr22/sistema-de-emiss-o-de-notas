export interface FocusNfeEmitente {
  cnpj: string;
  nome: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  regime_tributario: '1' | '2' | '3';
}

export interface FocusNfeDestinatario {
  cnpj_cpf: string;
  nome: string;
  email?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  municipio?: string;
  uf?: string;
  cep?: string;
  indicador_ie_destinatario?: '1' | '2' | '9';
}

export interface FocusNfeItem {
  numero_item: string;
  codigo_produto: string;
  descricao: string;
  cfop: string;
  unidade_comercial: string;
  quantidade_comercial: string;
  valor_unitario_comercial: string;
  valor_unitario_tributavel: string;
  unidade_tributavel: string;
  quantidade_tributavel: string;
  valor_bruto: string;
  inclui_no_total: '0' | '1';
  pis_situacao_tributaria: string;
  cofins_situacao_tributaria: string;
}

export interface FocusNfeFormaPagamento {
  forma_pagamento: string;
  valor_pagamento: string;
}

export interface FocusNfePayload {
  natureza_operacao: string;
  tipo_documento: '0' | '1';
  local_destino: '1' | '2' | '3';
  consumidor_final: '0' | '1';
  presenca_comprador: '0' | '1' | '2' | '3' | '4' | '5' | '9';
  informacoes_adicionais_contribuinte?: string;
  emitente: FocusNfeEmitente;
  destinatario: FocusNfeDestinatario;
  itens: FocusNfeItem[];
  formas_pagamento: FocusNfeFormaPagamento[];
}

export interface FocusNfeResponse {
  status:
    | 'autorizado'
    | 'processando_autorizacao'
    | 'erro_autorizacao'
    | 'cancelado'
    | 'denegado';
  status_sefaz?: string;
  mensagem_sefaz?: string;
  chave_nfe?: string;
  numero?: string;
  serie?: string;
  caminho_xml_nota_fiscal?: string;
  caminho_danfe?: string;
  protocolo?: string;
  erros?: Array<{ codigo: string; mensagem: string }>;
}
