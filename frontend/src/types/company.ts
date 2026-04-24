export interface Company {
  id: string;
  cnpj: string;
  name: string;
  tradeName: string | null;
  email: string | null;
  phone: string | null;
  street: string | null;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  ibgeCode: string | null;
  regime: 'MEI' | 'SIMPLES_NACIONAL';
  situation: string | null;
  trialEndsAt: string | null;
  planId: string | null;
  createdAt: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
}

export interface CnpjLookup {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string | null;
  email: string | null;
  telefone: string | null;
  situacao: string;
  naturezaJuridica: string;
  cnaeCode: string | null;
  cnaeDesc: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  municipio: string | null;
  uf: string | null;
  cep: string | null;
  ibgeCode: string | null;
}
