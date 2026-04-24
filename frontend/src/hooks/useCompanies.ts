import { api } from '../lib/api';
import { Company, CnpjLookup } from '../types/company';

export const companiesApi = {
  list: () => api.get<Company[]>('/v1/companies').then((r) => r.data),

  create: (data: {
    cnpj: string;
    name: string;
    tradeName?: string;
    email?: string;
    phone?: string;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    ibgeCode?: string;
  }) => api.post<Company>('/v1/companies', data).then((r) => r.data),

  get: (id: string) => api.get<Company>(`/v1/companies/${id}`).then((r) => r.data),

  update: (id: string, data: Partial<Company>) =>
    api.patch<Company>(`/v1/companies/${id}`, data).then((r) => r.data),

  lookupCnpj: (cnpj: string) =>
    api.get<CnpjLookup>(`/v1/companies/cnpj/${cnpj.replace(/\D/g, '')}`).then((r) => r.data),
};
