import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useCompany } from '../../contexts/CompanyContext';

interface Plan {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  interval: 'monthly' | 'annual';
  features: string[];
  highlighted?: boolean;
}

function fmtBRL(cents: number) {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function PlansPage() {
  const { activeCompany } = useCompany();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Plan[]>('/v1/plans').then((r) => {
      setPlans(r.data);
      setLoading(false);
    });
  }, []);

  const trialExpired =
    activeCompany &&
    !activeCompany.planId &&
    (!activeCompany.trialEndsAt || new Date(activeCompany.trialEndsAt) <= new Date());

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', padding: '40px 16px' }}>
      {/* Header */}
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--color-muted)', fontSize: 14, padding: 0, marginBottom: 32,
          }}
        >
          ← Dashboard
        </button>

        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 10 }}>Escolha seu plano</h1>
          <p style={{ color: 'var(--color-muted)', fontSize: 16 }}>
            Emissão ilimitada de NF-e e NFS-e para MEI.
          </p>

          {trialExpired && (
            <div
              style={{
                marginTop: 20, padding: '12px 20px', background: '#fef2f2',
                border: '1px solid #fecaca', borderRadius: 8,
                fontSize: 14, color: '#991b1b', display: 'inline-block',
              }}
            >
              Seu trial expirou. Assine um plano para continuar emitindo notas.
            </div>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--color-muted)' }}>Carregando planos...</div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 24,
            }}
          >
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} current={activeCompany?.planId === plan.id} />
            ))}
          </div>
        )}

        <p style={{ textAlign: 'center', color: 'var(--color-muted)', fontSize: 13, marginTop: 40 }}>
          Dúvidas? Entre em contato: <a href="mailto:suporte@mfmei.com.br" style={{ color: 'var(--color-primary)' }}>suporte@mfmei.com.br</a>
        </p>
      </div>
    </div>
  );
}

function PlanCard({ plan, current }: { plan: Plan; current: boolean }) {
  const annualTotal = plan.interval === 'annual' ? plan.priceMonthly * 12 : null;

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: `2px solid ${plan.highlighted ? 'var(--color-primary)' : 'var(--color-border)'}`,
        borderRadius: 14,
        padding: '32px 28px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {plan.highlighted && (
        <div
          style={{
            position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
            background: 'var(--color-primary)', color: '#fff',
            fontSize: 12, fontWeight: 700, padding: '4px 14px', borderRadius: 20,
            whiteSpace: 'nowrap',
          }}
        >
          Mais popular
        </div>
      )}

      <div style={{ marginBottom: 6, fontSize: 18, fontWeight: 700 }}>{plan.name}</div>
      <div style={{ color: 'var(--color-muted)', fontSize: 14, marginBottom: 20 }}>{plan.description}</div>

      <div style={{ marginBottom: 6 }}>
        <span style={{ fontSize: 32, fontWeight: 800 }}>{fmtBRL(plan.priceMonthly)}</span>
        <span style={{ color: 'var(--color-muted)', fontSize: 14 }}>/mês</span>
      </div>
      {annualTotal && (
        <div style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 24 }}>
          Cobrado {fmtBRL(annualTotal)}/ano
        </div>
      )}
      {!annualTotal && <div style={{ marginBottom: 24 }} />}

      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28, flex: 1 }}>
        {plan.features.map((f) => (
          <li key={f} style={{ display: 'flex', gap: 8, fontSize: 14 }}>
            <span style={{ color: 'var(--color-success)', fontWeight: 700, flexShrink: 0 }}>✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {current ? (
        <div
          style={{
            textAlign: 'center', padding: '11px 0', border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)', fontSize: 14, color: 'var(--color-muted)',
          }}
        >
          Plano atual
        </div>
      ) : (
        <button
          onClick={() => alert(`Integração com gateway de pagamento em breve.\n\nPlano: ${plan.name}\nValor: ${fmtBRL(plan.priceMonthly)}/mês`)}
          style={{
            padding: '12px 0', width: '100%',
            background: plan.highlighted ? 'var(--color-primary)' : 'transparent',
            color: plan.highlighted ? '#fff' : 'var(--color-primary)',
            border: `2px solid var(--color-primary)`,
            borderRadius: 'var(--radius)', fontSize: 15, fontWeight: 600, cursor: 'pointer',
          }}
        >
          Assinar {plan.name}
        </button>
      )}
    </div>
  );
}
