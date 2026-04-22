import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: '⚡',
    title: 'Emissão em menos de 1 minuto',
    desc: 'Preencha os dados do tomador e do serviço. O resto é automático.',
  },
  {
    icon: '🧮',
    title: 'Motor fiscal automático',
    desc: 'O sistema detecta se você precisa de NF-e ou NFS-e com base no seu CNAE.',
  },
  {
    icon: '📄',
    title: 'NF-e e NFS-e',
    desc: 'Suporte completo a nota de produto e nota de serviço no padrão ABRASF.',
  },
  {
    icon: '📥',
    title: 'XML e DANFE/PDF',
    desc: 'Baixe o XML assinado e o DANFE (ou RPS) diretamente pelo painel.',
  },
  {
    icon: '📊',
    title: 'Limite MEI monitorado',
    desc: 'Acompanhe quanto você já faturou e quanto resta do limite de R$ 81.000.',
  },
  {
    icon: '🔒',
    title: 'Seguro e confiável',
    desc: 'Integração direta com a SEFAZ via Focus NFe. Seus dados ficam protegidos.',
  },
];

const STEPS = [
  { n: '1', title: 'Crie sua conta', desc: 'Cadastro gratuito em segundos. Sem cartão de crédito.' },
  { n: '2', title: 'Informe seu CNPJ', desc: 'Buscamos seus dados automaticamente na Receita Federal.' },
  { n: '3', title: 'Emita sua nota', desc: 'Preencha o tomador e o valor. Em menos de 1 minuto, pronto.' },
];

const PLANS = [
  {
    id: 'mensal',
    name: 'Mensal',
    price: 'R$ 29,90',
    period: '/mês',
    desc: 'Ideal para quem está começando.',
    features: ['NF-e e NFS-e ilimitadas', 'Motor fiscal automático', 'Download XML e DANFE/PDF', 'Suporte por e-mail'],
    highlighted: false,
    cta: 'Começar grátis',
  },
  {
    id: 'anual',
    name: 'Anual',
    price: 'R$ 16,90',
    period: '/mês',
    desc: 'Economize 44% — cobrado R$ 202,80/ano.',
    features: ['NF-e e NFS-e ilimitadas', 'Motor fiscal automático', 'Download XML e DANFE/PDF', 'Suporte prioritário', 'Desconto de 44% vs. mensal'],
    highlighted: true,
    cta: 'Começar grátis',
  },
];

const FAQ = [
  {
    q: 'Preciso de certificado digital?',
    a: 'Não para começar. A emissão em homologação funciona sem certificado. Para produção, o certificado digital é gerenciado pela Focus NFe.',
  },
  {
    q: 'O que acontece após o trial de 14 dias?',
    a: 'Você pode assinar um dos planos para continuar emitindo. Suas notas e dados ficam salvos.',
  },
  {
    q: 'Funciona para qualquer CNAE MEI?',
    a: 'Sim. O motor fiscal cobre todos os CNAEs permitidos para MEI e determina automaticamente o tipo de nota correto.',
  },
  {
    q: 'Posso cancelar a qualquer momento?',
    a: 'Sim. Não há fidelidade. Cancele quando quiser pelo painel ou por e-mail.',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const pricingRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!loading && user) navigate('/dashboard', { replace: true });
  }, [user, loading, navigate]);

  const scrollTo = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) return null;

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#0f172a', overflowX: 'hidden' }}>

      {/* ── Navbar ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', height: 60,
      }}>
        <span style={{ fontWeight: 800, fontSize: 20, color: '#2563eb', letterSpacing: '-0.5px' }}>
          MF Mei
        </span>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <button onClick={() => scrollTo(featuresRef)} style={navBtn}>Funcionalidades</button>
          <button onClick={() => scrollTo(pricingRef)} style={navBtn}>Preços</button>
          <Link to="/login" style={{ fontSize: 14, color: '#64748b', textDecoration: 'none', fontWeight: 500 }}>Entrar</Link>
          <Link to="/cadastro" style={primaryBtn}>Começar grátis</Link>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section style={{
        background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 60%, #f0fdf4 100%)',
        padding: '96px 32px 80px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#dbeafe', color: '#1d4ed8', borderRadius: 20,
            padding: '5px 14px', fontSize: 13, fontWeight: 600, marginBottom: 28,
          }}>
            <span>✦</span> 14 dias grátis · sem cartão de crédito
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 58px)', fontWeight: 800,
            lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: 22,
            color: '#0f172a',
          }}>
            Emita sua nota fiscal{' '}
            <span style={{ color: '#2563eb' }}>em menos de 1 minuto</span>
          </h1>

          <p style={{
            fontSize: 18, color: '#475569', lineHeight: 1.7,
            marginBottom: 40, maxWidth: 520, margin: '0 auto 40px',
          }}>
            O sistema mais simples para MEI emitir NF-e e NFS-e.
            Motor fiscal automático — sem precisar entender de contabilidade.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/cadastro" style={{
              padding: '14px 32px', background: '#2563eb', color: '#fff',
              borderRadius: 10, textDecoration: 'none', fontSize: 16, fontWeight: 700,
              boxShadow: '0 4px 16px rgb(37 99 235 / 0.35)',
              transition: 'transform 0.15s',
            }}>
              Criar conta gratuita
            </Link>
            <button onClick={() => scrollTo(featuresRef)} style={{
              padding: '14px 32px', background: '#fff', color: '#374151',
              border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 16,
              fontWeight: 600, cursor: 'pointer',
            }}>
              Ver funcionalidades
            </button>
          </div>

          {/* Social proof */}
          <div style={{ marginTop: 48, display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
            {[
              { n: '< 1 min', label: 'para emitir uma nota' },
              { n: 'R$ 81k', label: 'limite MEI monitorado' },
              { n: '100%', label: 'integrado à SEFAZ' },
            ].map(({ n, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#2563eb' }}>{n}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section ref={featuresRef} style={{ padding: '80px 32px', background: '#fff' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <SectionHeader
            tag="Funcionalidades"
            title="Tudo que um MEI precisa"
            sub="Nada mais, nada menos. Feito para funcionar sem burocracia."
          />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20, marginTop: 48,
          }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{
                padding: '24px', borderRadius: 12,
                border: '1px solid #e2e8f0', background: '#f8fafc',
              }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ padding: '80px 32px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <SectionHeader
            tag="Como funciona"
            title="Do cadastro à nota em 3 passos"
            sub="Sem treinamento. Sem manual. Você já sabe usar."
          />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 0, marginTop: 48, position: 'relative',
          }}>
            {STEPS.map((s, i) => (
              <div key={s.n} style={{ textAlign: 'center', padding: '0 24px', position: 'relative' }}>
                {i < STEPS.length - 1 && (
                  <div style={{
                    position: 'absolute', top: 28, right: 0, width: '50%',
                    height: 2, background: '#bfdbfe', display: 'none',
                  }} />
                )}
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: '#fff', fontWeight: 800, fontSize: 20,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: '0 4px 12px rgb(37 99 235 / 0.3)',
                }}>
                  {s.n}
                </div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section ref={pricingRef} style={{ padding: '80px 32px', background: '#fff' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <SectionHeader
            tag="Preços"
            title="Simples e transparente"
            sub="Comece grátis por 14 dias. Depois escolha o plano ideal."
          />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24, marginTop: 48,
          }}>
            {PLANS.map((p) => (
              <div key={p.id} style={{
                border: `2px solid ${p.highlighted ? '#2563eb' : '#e2e8f0'}`,
                borderRadius: 16, padding: '32px 28px',
                position: 'relative', background: '#fff',
                boxShadow: p.highlighted ? '0 8px 32px rgb(37 99 235 / 0.12)' : 'none',
              }}>
                {p.highlighted && (
                  <div style={{
                    position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                    background: '#2563eb', color: '#fff', fontSize: 12, fontWeight: 700,
                    padding: '4px 16px', borderRadius: 20, whiteSpace: 'nowrap',
                  }}>
                    Mais popular
                  </div>
                )}
                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>{p.desc}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
                  <span style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1px' }}>{p.price}</span>
                  <span style={{ fontSize: 14, color: '#64748b' }}>{p.period}</span>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                  {p.features.map((f) => (
                    <li key={f} style={{ display: 'flex', gap: 8, fontSize: 14, alignItems: 'flex-start' }}>
                      <span style={{ color: '#16a34a', fontWeight: 700, flexShrink: 0 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/cadastro" style={{
                  display: 'block', textAlign: 'center',
                  padding: '12px 0', borderRadius: 8, fontSize: 15, fontWeight: 600,
                  textDecoration: 'none',
                  background: p.highlighted ? '#2563eb' : 'transparent',
                  color: p.highlighted ? '#fff' : '#2563eb',
                  border: `2px solid #2563eb`,
                }}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: 13, color: '#94a3b8', marginTop: 24 }}>
            14 dias grátis · sem cartão · cancele quando quiser
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '80px 32px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <SectionHeader
            tag="Dúvidas frequentes"
            title="Perguntas e respostas"
          />
          <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {FAQ.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{
        padding: '80px 32px',
        background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 16, letterSpacing: '-0.5px' }}>
            Comece grátis hoje
          </h2>
          <p style={{ fontSize: 16, color: '#bfdbfe', marginBottom: 36, lineHeight: 1.6 }}>
            14 dias de trial completo. Sem cartão. Sem pegadinhas.
            Se não gostar, basta não assinar.
          </p>
          <Link to="/cadastro" style={{
            display: 'inline-block', padding: '16px 40px',
            background: '#fff', color: '#1e40af',
            borderRadius: 10, textDecoration: 'none',
            fontSize: 16, fontWeight: 800,
            boxShadow: '0 4px 20px rgb(0 0 0 / 0.2)',
          }}>
            Criar minha conta gratuita
          </Link>
          <p style={{ fontSize: 13, color: '#93c5fd', marginTop: 16 }}>
            Já tem conta?{' '}
            <Link to="/login" style={{ color: '#fff', fontWeight: 600 }}>Entrar</Link>
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        background: '#0f172a', color: '#94a3b8',
        padding: '32px', textAlign: 'center', fontSize: 14,
      }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <span style={{ fontWeight: 700, color: '#e2e8f0', fontSize: 16 }}>MF Mei</span>
          <span>© {new Date().getFullYear()} MF Contábil. Todos os direitos reservados.</span>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none' }}>Entrar</Link>
            <Link to="/cadastro" style={{ color: '#94a3b8', textDecoration: 'none' }}>Cadastro</Link>
            <a href="mailto:suporte@mfmei.com.br" style={{ color: '#94a3b8', textDecoration: 'none' }}>Suporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ tag, title, sub }: { tag: string; title: string; sub?: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        display: 'inline-block', background: '#eff6ff', color: '#1d4ed8',
        borderRadius: 20, padding: '4px 14px', fontSize: 12,
        fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16,
      }}>
        {tag}
      </div>
      <h2 style={{ fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: sub ? 12 : 0 }}>
        {title}
      </h2>
      {sub && <p style={{ fontSize: 16, color: '#64748b', maxWidth: 480, margin: '0 auto' }}>{sub}</p>}
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details style={{
      background: '#fff', border: '1px solid #e2e8f0',
      borderRadius: 10, overflow: 'hidden',
    }}>
      <summary style={{
        padding: '16px 20px', fontWeight: 600, fontSize: 15,
        cursor: 'pointer', listStyle: 'none', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
        userSelect: 'none',
      }}>
        {q}
        <span style={{ fontSize: 20, color: '#94a3b8', flexShrink: 0, marginLeft: 12 }}>+</span>
      </summary>
      <div style={{ padding: '0 20px 16px', fontSize: 14, color: '#64748b', lineHeight: 1.7, borderTop: '1px solid #f1f5f9' }}>
        {a}
      </div>
    </details>
  );
}

// ─── Shared styles ─────────────────────────────────────────────────────────────

const navBtn: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer',
  fontSize: 14, color: '#374151', fontWeight: 500, padding: 0,
};

const primaryBtn: React.CSSProperties = {
  padding: '8px 18px', background: '#2563eb', color: '#fff',
  borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 600,
};
