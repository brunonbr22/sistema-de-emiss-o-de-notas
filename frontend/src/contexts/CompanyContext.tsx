import {
  createContext, useContext, useEffect, useState, useCallback, ReactNode,
} from 'react';
import { companiesApi } from '../hooks/useCompanies';
import { Company } from '../types/company';
import { useAuth } from './AuthContext';

interface CompanyContextValue {
  companies: Company[];
  activeCompany: Company | null;
  loading: boolean;
  setActiveCompany: (company: Company) => void;
  reload: () => Promise<void>;
}

const CompanyContext = createContext<CompanyContextValue | null>(null);

const ACTIVE_KEY = 'mfmei:activeCompanyId';

export function CompanyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeCompany, setActiveCompanyState] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setCompanies([]);
      setActiveCompanyState(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const list = await companiesApi.list();
      setCompanies(list);

      const savedId = localStorage.getItem(ACTIVE_KEY);
      const active =
        list.find((c) => c.id === savedId) ?? list[0] ?? null;
      setActiveCompanyState(active);
      if (active) localStorage.setItem(ACTIVE_KEY, active.id);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const setActiveCompany = (company: Company) => {
    localStorage.setItem(ACTIVE_KEY, company.id);
    setActiveCompanyState(company);
  };

  return (
    <CompanyContext.Provider
      value={{ companies, activeCompany, loading, setActiveCompany, reload: load }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error('useCompany must be inside CompanyProvider');
  return ctx;
}
