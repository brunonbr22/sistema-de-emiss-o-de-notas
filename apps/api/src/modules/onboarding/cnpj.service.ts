import { Injectable } from '@nestjs/common';

@Injectable()
export class CnpjService {
  async fetchByCnpj(cnpj: string) {
    const normalized = cnpj.replace(/\D/g, '');
    const fallback = {
      cnpj: normalized,
      razao_social: 'Empresa Demo MEI',
      nome_fantasia: 'Empresa Demo',
      municipio: 'São Paulo',
      uf: 'SP',
      cnae_fiscal_principal: '6201-5/02',
      natureza_juridica: '213-5 - Empresário (Individual)',
    };

    try {
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${normalized}`);
      if (!response.ok) return fallback;
      return await response.json();
    } catch {
      return fallback;
    }
  }
}
