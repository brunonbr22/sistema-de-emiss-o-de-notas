import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCompany } from '../contexts/CompanyContext';
import { useDashboard, RecentInvoice } from '../hooks/useDashboard';
import { CompanySelector } from '../components/CompanySelector';

function isPlanActive(company: { planId: string | null; trialEndsAt: string | null } | null): boolean {
  if (!company) return false;
  if (company.planId) return true;
  return !!company.trialEndsAt && new Date(company.trialEndsAt) > new Date();
}

function fmtBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function fmtDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-BR');
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { companies, activeCompany, loading: companyLoading } = useCompany();
  const navigate = useNavigate();
  const canEmit = isPlanActive(activeCompany);
  const { data, loading: dashLoading, error } = useDashboard(activeCompany?.id);

  useEffect(() => {
    if (!companyLoading && companies.length === 0) navigate('/onboarding');
  }, [companyLoading, companies, navigate]);

  const handleLogout = () => { logout(); navigate('/login'); };

  if (companyLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '40vh', color: 'var(--color-muted)' }}>
        Carregando...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Header */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', height: 60,
        background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 18 }}>MF Mei</span>
          <CompanySelector />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 14, color: 'var(--color-muted)' }}>{user?.name}</span>
          <button
            onClick={handleLogout}
            style={{
              fontSize: 14, padding: '6px 14px', border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)', background: 'transparent', cursor: 'pointer',
            }}
          >
            Sair
          </button>
        </div>
      </header>

      <main style={{ padding: '32px', maxWidth: 1100, margin: '0 auto' }}>
        {/* Greeting */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 2 }}>
              Olá, {user?.name?.split(' ')[0]}!
            </h2>
            {activeCompany && (
              <p style={{ color: 'var(--color-muted)', fontSize: 14 }}>
                {activeCompany.tradeName || activeCompany.name}
              </p>
            )}
          </div>
          {canEmit ? (
            <Link to="/emitir" style={{
              padding: '10px 22px', background: 'var(--color-primary)', color: '#fff',
              borderRadius: 'var(--radius)', textDecoration: 'none', fontSize: 14,
              fontWeight: 600, boxShadow: '0 2px 8px rgb(37 99 235 / 0.25)',
            }}>
              + Emitir nota fiscal
            </Link>
          ) : (
            <Link to="/planos" style={{
              padding: '10px 22px', background: 'var(--color-error)', color: '#fff',
              borderRadius: 'var(--radius)', textDecoration: 'none', fontSize: 14, fontWeight: 600,
            }}>
              Assinar plano
            </Link>
          )}
        </div>

        {/* Trial / plan banner */}
        {activeCompany && !activeCompany.planId && (
          <TrialBanner endsAt={activeCompany.trialEndsAt} />
        )}

        {error && (
          <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, fontSize: 14, color: 'var(--color-error)', marginBottom: 20 }}>
            {error}
          </div>
        )}

        {dashLoading && !data && (
          <div style={{ color: 'var(--color-muted)', padding: '40px 0', textAlign: 'center' }}>Carregando métricas...</div>
        )}

        {data && (
          <>
            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
              <StatCard
                label="Emitido este mês"
                value={fmtBRL(data.month.total)}
                sub={`${data.month.count} nota${data.month.count !== 1 ? 's' : ''}`}
              />
              <StatCard
                label="Emitido este ano"
                value={fmtBRL(data.year.total)}
                sub={`${data.year.count} nota${data.year.count !== 1 ? 's' : ''}`}
              />
              <StatCard
                label="Disponível MEI"
                value={fmtBRL(data.year.remaining)}
                sub={`de ${fmtBRL(data.year.limit)}`}
                warn={data.year.limitWarning}
                danger={data.year.limitExceeded}
              />
              <StatCard
                label="Plano"
                value={data.plan.planId ? 'Ativo' : data.plan.trialDaysLeft !== null && data.plan.trialDaysLeft > 0 ? 'Trial' : 'Expirado'}
                sub={
                  data.plan.planId
                    ? data.plan.planId
                    : data.plan.trialDaysLeft !== null && data.plan.trialDaysLeft > 0
                    ? `${data.plan.trialDaysLeft} dia${data.plan.trialDaysLeft !== 1 ? 's' : ''} restantes`
                    : 'Assine para continuar'
                }
                danger={!data.plan.active}
                planLink={!data.plan.active}
              />
            </div>

            {/* MEI limit bar */}
            <MeiLimitBar
              usedPercent={data.year.usedPercent}
              yearTotal={data.year.total}
              limit={data.year.limit}
              warning={data.year.limitWarning}
              exceeded={data.year.limitExceeded}
            />

            {/* Recent invoices */}
            <RecentInvoicesTable invoices={data.recentInvoices} />
          </>
        )}
      </main>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, warn, danger, planLink,
}: {
  label: string; value: string; sub?: string;
  warn?: boolean; danger?: boolean; planLink?: boolean;
}) {
  const color = danger ? 'var(--color-error)' : warn ? '#d97706' : 'var(--color-text)';
  return (
    <div style={{
      background: 'var(--color-surface)', border: '1px solid var(--color-border)',
      borderRadius: 12, padding: '20px 22px',
    }}>
      <div style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color, marginBottom: 4 }}>{value}</div>
      {sub && (
        planLink ? (
          <Link to="/planos" style={{ fontSize: 13, color: 'var(--color-error)', textDecoration: 'underline' }}>{sub}</Link>
        ) : (
          <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>{sub}</div>
        )
      )}
    </div>
  );
}

function MeiLimitBar({
  usedPercent, yearTotal, limit, warning, exceeded,
}: {
  usedPercent: number; yearTotal: number; limit: number; warning: boolean; exceeded: boolean;
}) {
  const barColor = exceeded ? 'var(--color-error)' : warning ? '#f59e0b' : 'var(--color-success)';
  const pct = Math.min(100, usedPercent);

  return (
    <div style={{
      background: 'var(--color-surface)', border: '1px solid var(--color-border)',
      borderRadius: 12, padding: '20px 22px', marginBottom: 24,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontWeight: 600, fontSize: 14 }}>Limite anual MEI</span>
        <span style={{ fontSize: 13, color: exceeded ? 'var(--color-error)' : 'var(--color-muted)' }}>
          {pct.toFixed(1)}% utilizado
        </span>
      </div>
      <div style={{ height: 10, background: 'var(--color-border)', borderRadius: 5, overflow: 'hidden', marginBottom: 8 }}>
        <div style={{
          height: '100%', width: `${pct}%`, background: barColor,
          borderRadius: 5, transition: 'width 0.5s',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--color-muted)' }}>
        <span>
          {yearTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} emitidos
        </span>
        <span>Limite: {limit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
      </div>
      {warning && !exceeded && (
        <div style={{ marginTop: 8, fontSize: 13, color: '#92400e', background: '#fffbeb', borderRadius: 6, padding: '6px 10px' }}>
          Atenção: você já utilizou mais de 80% do limite anual MEI.
        </div>
      )}
      {exceeded && (
        <div style={{ marginTop: 8, fontSize: 13, color: 'var(--color-error)', background: '#fef2f2', borderRadius: 6, padding: '6px 10px' }}>
          Limite anual MEI excedido. Novas emissões estão bloqueadas.
        </div>
      )}
    </div>
  );
}

const STATUS_LABEL: Record<string, { text: string; color: string; bg: string }> = {
  ISSUED:   { text: 'Autorizada',    color: 'var(--color-success)', bg: '#f0fdf4' },
  PENDING:  { text: 'Processando',   color: '#92400e',              bg: '#fffbeb' },
  REJECTED: { text: 'Rejeitada',     color: 'var(--color-error)',   bg: '#fef2f2' },
  CANCELED: { text: 'Cancelada',     color: 'var(--color-muted)',   bg: 'var(--color-bg)' },
  DRAFT:    { text: 'Rascunho',      color: 'var(--color-muted)',   bg: 'var(--color-bg)' },
};

function RecentInvoicesTable({ invoices }: { invoices: RecentInvoice[] }) {
  return (
    <div style={{
      background: 'var(--color-surface)', border: '1px solid var(--color-border)',
      borderRadius: 12, overflow: 'hidden',
    }}>
      <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 600, fontSize: 14 }}>Últimas notas emitidas</span>
        <Link to="/emitir" style={{ fontSize: 13, color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>
          + Nova nota
        </Link>
      </div>

      {invoices.length === 0 ? (
        <div style={{ padding: '40px 22px', textAlign: 'center', color: 'var(--color-muted)', fontSize: 14 }}>
          Nenhuma nota emitida ainda.{' '}
          <Link to="/emitir" style={{ color: 'var(--color-primary)' }}>Emitir primeira nota →</Link>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'var(--color-bg)' }}>
                {['Tipo', 'Tomador', 'Descrição', 'Valor', 'Status', 'Data'].map((h) => (
                  <th key={h} style={{
                    padding: '10px 16px', textAlign: 'left', fontWeight: 600,
                    fontSize: 12, color: 'var(--color-muted)', textTransform: 'uppercase',
                    letterSpacing: '0.05em', borderBottom: '1px solid var(--color-border)',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, i) => {
                const st = STATUS_LABEL[inv.status] ?? STATUS_LABEL.DRAFT;
                const isLast = i === invoices.length - 1;
                return (
                  <tr key={inv.id} style={{ borderBottom: isLast ? 'none' : '1px solid var(--color-border)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                        background: inv.type === 'NFE' ? '#eff6ff' : '#f0fdf4',
                        color: inv.type === 'NFE' ? 'var(--color-primary)' : 'var(--color-success)',
                      }}>
                        {inv.type === 'NFE' ? 'NF-e' : 'NFS-e'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {inv.takerName}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {inv.serviceDesc}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 500, whiteSpace: 'nowrap' }}>
                      {Number(inv.grossValue).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        fontSize: 12, fontWeight: 600, padding: '3px 8px', borderRadius: 4,
                        color: st.color, background: st.bg,
                      }}>
                        {st.text}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>
                      {fmtDate(inv.issuedAt ?? inv.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TrialBanner({ endsAt }: { endsAt: string | null }) {
  const days = endsAt ? Math.ceil((new Date(endsAt).getTime() - Date.now()) / 86400000) : -1;
  const expired = days < 0;
  const urgent = !expired && days <= 3;
  const bg = expired || urgent ? '#fef2f2' : '#eff6ff';
  const border = expired || urgent ? '#fecaca' : '#bfdbfe';
  const color = expired || urgent ? '#991b1b' : '#1e40af';
  const btnBg = expired || urgent ? '#dc2626' : 'var(--color-primary)';
  const label = expired
    ? 'Seu trial expirou.'
    : days === 0 ? 'Seu trial gratuito expira hoje!'
    : `Seu trial gratuito expira em ${days} dia${days !== 1 ? 's' : ''}.`;

  return (
    <div style={{
      background: bg, border: `1px solid ${border}`, borderRadius: 8,
      padding: '12px 16px', fontSize: 14, color, marginBottom: 20,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
    }}>
      <span>{label}</span>
      <Link to="/planos" style={{
        fontSize: 13, fontWeight: 600, padding: '5px 12px', background: btnBg,
        color: '#fff', borderRadius: 6, textDecoration: 'none', whiteSpace: 'nowrap',
      }}>
        {expired ? 'Assinar agora' : 'Ver planos'}
      </Link>
    </div>
  );
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR');
}
