import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../contexts/CompanyContext';
import { Company } from '../types/company';

export function CompanySelector() {
  const { companies, activeCompany, setActiveCompany } = useCompany();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (companies.length === 0) return null;

  const select = (c: Company) => {
    setActiveCompany(c);
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '5px 12px', border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius)', background: 'var(--color-surface)',
          cursor: 'pointer', fontSize: 13, maxWidth: 220,
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {activeCompany?.tradeName || activeCompany?.name || 'Selecionar empresa'}
        </span>
        <span style={{ color: 'var(--color-muted)', fontSize: 10 }}>▼</span>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute', top: '110%', left: 0, zIndex: 100,
            background: 'var(--color-surface)', border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)', boxShadow: '0 8px 24px rgb(0 0 0 / 0.12)',
            minWidth: 220, overflow: 'hidden',
          }}
        >
          {companies.map((c) => (
            <button
              key={c.id}
              onClick={() => select(c)}
              style={{
                display: 'block', width: '100%', padding: '10px 14px', textAlign: 'left',
                border: 'none', background: c.id === activeCompany?.id ? '#eff6ff' : 'transparent',
                cursor: 'pointer', fontSize: 13, borderBottom: '1px solid var(--color-border)',
              }}
            >
              <div style={{ fontWeight: 500 }}>{c.tradeName || c.name}</div>
              <div style={{ color: 'var(--color-muted)', fontSize: 11 }}>
                {c.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')}
              </div>
            </button>
          ))}
          <button
            onClick={() => { setOpen(false); navigate('/onboarding'); }}
            style={{
              display: 'block', width: '100%', padding: '10px 14px', textAlign: 'left',
              border: 'none', background: 'transparent', cursor: 'pointer',
              fontSize: 13, color: 'var(--color-primary)', fontWeight: 500,
            }}
          >
            + Adicionar empresa
          </button>
        </div>
      )}
    </div>
  );
}
