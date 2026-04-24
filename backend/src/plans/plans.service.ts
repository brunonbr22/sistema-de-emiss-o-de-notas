import { Injectable } from '@nestjs/common';

export interface Plan {
  id: string;
  name: string;
  description: string;
  priceMonthly: number; // em centavos
  interval: 'monthly' | 'annual';
  features: string[];
  highlighted?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: 'basic-monthly',
    name: 'Mensal',
    description: 'Ideal para quem está começando.',
    priceMonthly: 2990,
    interval: 'monthly',
    features: [
      'NF-e e NFS-e ilimitadas',
      'Motor fiscal automático',
      'Download XML e DANFE/PDF',
      'Suporte por e-mail',
    ],
  },
  {
    id: 'basic-annual',
    name: 'Anual',
    description: 'Melhor custo-benefício — economize 44%.',
    priceMonthly: 1690,
    interval: 'annual',
    features: [
      'NF-e e NFS-e ilimitadas',
      'Motor fiscal automático',
      'Download XML e DANFE/PDF',
      'Suporte prioritário',
      'Desconto de 44% vs. mensal',
    ],
    highlighted: true,
  },
];

@Injectable()
export class PlansService {
  list(): Plan[] {
    return PLANS;
  }

  findById(id: string): Plan | undefined {
    return PLANS.find((p) => p.id === id);
  }
}
