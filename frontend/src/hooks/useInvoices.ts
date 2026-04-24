import { api } from '../lib/api';
import { FiscalCheckResult, EmitResponse, NfseConfig } from '../types/invoice';

export const fiscalApi = {
  check: (companyId: string, data: { cnaeCode: string; grossValue: string; ibgeCode?: string }) =>
    api
      .post<FiscalCheckResult>(`/v1/fiscal/companies/${companyId}/check`, data)
      .then((r) => r.data),
};

export const invoicesApi = {
  emitNfe: (
    companyId: string,
    data: {
      takerDocument: string;
      takerName: string;
      takerEmail?: string;
      serviceDesc: string;
      cfop: string;
      grossValue: number;
      cnaeCode: string;
      naturezaOperacao?: string;
      informacoesAdicionais?: string;
      takerAddress?: {
        logradouro?: string;
        numero?: string;
        bairro?: string;
        municipio?: string;
        uf?: string;
        cep?: string;
      };
    },
  ) =>
    api
      .post<EmitResponse>(`/v1/invoices/nfe/companies/${companyId}`, data)
      .then((r) => r.data),

  emitNfse: (
    companyId: string,
    data: {
      takerDocument: string;
      takerName: string;
      takerEmail?: string;
      serviceDesc: string;
      ibgeCode: string;
      cnaeCode: string;
      grossValue: number;
      itemListaServico?: string;
      codigoTributacaoMunicipio?: string;
      informacoesAdicionais?: string;
      takerAddress?: {
        logradouro?: string;
        numero?: string;
        complemento?: string;
        bairro?: string;
        codigoMunicipio?: string;
        uf?: string;
        cep?: string;
      };
    },
  ) =>
    api
      .post<EmitResponse>(`/v1/invoices/nfse/companies/${companyId}`, data)
      .then((r) => r.data),

  getNfeStatus: (id: string) =>
    api.get<EmitResponse>(`/v1/invoices/nfe/${id}`).then((r) => r.data),

  getNfseStatus: (id: string) =>
    api.get<EmitResponse>(`/v1/invoices/nfse/${id}`).then((r) => r.data),

  listNfseConfigs: (companyId: string) =>
    api
      .get<NfseConfig[]>(`/v1/invoices/nfse-config/companies/${companyId}`)
      .then((r) => r.data),

  upsertNfseConfig: (
    companyId: string,
    data: { ibgeCode: string; inscricaoMunicipal: string; itemListaServico: string; codigoTributacaoMunicipio?: string },
  ) =>
    api
      .put<NfseConfig>(`/v1/invoices/nfse-config/companies/${companyId}`, data)
      .then((r) => r.data),
};
