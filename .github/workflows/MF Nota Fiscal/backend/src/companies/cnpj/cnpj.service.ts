import { Injectable, BadRequestException, ServiceUnavailableException } from '@nestjs/common';

export interface CnpjData {
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

@Injectable()
export class CnpjService {
  async lookup(cnpj: string): Promise<CnpjData> {
    const clean = cnpj.replace(/\D/g, '');
    if (clean.length !== 14) throw new BadRequestException('CNPJ inválido.');

    let res: Response;
    try {
      res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${clean}`, {
        signal: AbortSignal.timeout(8000),
      });
    } catch {
      throw new ServiceUnavailableException('Não foi possível consultar o CNPJ. Tente novamente.');
    }

    if (res.status === 404) throw new BadRequestException('CNPJ não encontrado na Receita Federal.');
    if (!res.ok) throw new ServiceUnavailableException('Serviço de consulta de CNPJ indisponível.');

    const d = await res.json();

    return {
      cnpj: clean,
      razaoSocial: d.razao_social ?? '',
      nomeFantasia: d.nome_fantasia || null,
      email: d.email || null,
      telefone: d.ddd_telefone_1 ? d.ddd_telefone_1.replace(/\D/g, '') : null,
      situacao: d.descricao_situacao_cadastral ?? d.situacao_cadastral ?? '',
      naturezaJuridica: d.natureza_juridica ?? '',
      cnaeCode: d.cnae_fiscal ? String(d.cnae_fiscal) : null,
      cnaeDesc: d.cnae_fiscal_descricao || null,
      logradouro: d.logradouro || null,
      numero: d.numero || null,
      complemento: d.complemento || null,
      bairro: d.bairro || null,
      municipio: d.municipio || null,
      uf: d.uf || null,
      cep: d.cep ? d.cep.replace(/\D/g, '') : null,
      ibgeCode: d.codigo_municipio_ibge ? String(d.codigo_municipio_ibge) : null,
    };
  }
}
