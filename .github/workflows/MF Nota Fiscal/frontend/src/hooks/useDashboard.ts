import { useEffect, useState, useCallback } from 'react';
import { api } from '../lib/api';

export interface RecentInvoice {
  id: string;
  type: 'NFE' | 'NFSE';
  status: 'DRAFT' | 'PENDING' | 'ISSUED' | 'REJECTED' | 'CANCELED';
  number: string | null;
  takerName: string;
  grossValue: string;
  netValue: string;
  serviceDesc: string;
  issuedAt: string | null;
  createdAt: string;
}

export interface DashboardSummary {
  month: { total: number; count: number };
  year: {
    total: number; count: number; limit: number; remaining: number;
    usedPercent: number; limitWarning: boolean; limitExceeded: boolean;
  };
  plan: {
    active: boolean; planId: string | null;
    trialEndsAt: string | null; trialDaysLeft: number | null;
  };
  recentInvoices: RecentInvoice[];
}

export function useDashboard(companyId: string | null | undefined) {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetch = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.get<DashboardSummary>(`/v1/dashboard/companies/${companyId}`);
      setData(res.data);
    } catch {
      setError('Não foi possível carregar os dados do dashboard.');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, reload: fetch };
}
