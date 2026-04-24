import { WizardData } from '../../../types/invoice';
import { Company } from '../../../types/company';

interface Props {
  data: WizardData;
  company: Company;
  onNext: () => void;
  onBack: () => void;
  emitting: boolean;
  error: string;
}

function fmt(n: number) {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-muted)', letterSpacing: '0.06em', marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '6px 12px', fontSize: 14 }}>
        {children}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <>
      <span style={{ color: 'var(--color-muted)' }}>{label}</span>
      <span style={{ color: 'var(--color-text)', wordBreak: 'break-word' }}>{value || '—'}</span>
    </>
  );
}

export function Step4Revisao({ data, company, onNext, onBack, emitting, error }: Props) {
  const { fiscalResult: f, invoiceType } = data;

  const typeBadge = (
    <span
      style={{
        display: 'inline-block', padding: '2px 10px', borderRadius: 20, fontSize: 13, fontWeight: 700,
        background: invoiceType === 'NFE' ? '#eff6ff' : '#f0fdf4',
        color: invoiceType === 'NFE' ? 'var(--color-primary)' : 'var(--color-success)',
      }}
    >
      {invoiceType === 'NFE' ? 'NF-e' : 'NFS-e'}
    </span>
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600 }}>Revisão</h2>
        {typeBadge}
      </div>
      <p style={{ color: 'var(--color-muted)', fontSize: 14, marginBottom: 24 }}>
        Confira os dados antes de emitir. Esta ação não pode ser desfeita facilmente.
      </p>

      <div
        style={{
          background: 'var(--color-bg)', border: '1px solid var(--color-border)',
          borderRadius: 10, padding: '20px 20px', marginBottom: 20,
        }}
      >
        <Section title="Emissor">
          <Row label="Empresa" value={company.tradeName || company.name} />
          <Row label="CNPJ" value={company.cnpj} />
        </Section>

        <div style={{ borderTop: '1px solid var(--color-border)', margin: '16px 0' }} />

        <Section title="Tomador">
          <Row label="Documento" value={data.takerDocument} />
          <Row label="Nome" value={data.takerName} />
          {data.takerEmail && <Row label="E-mail" value={data.takerEmail} />}
          {data.takerMunicipio && <Row label="Cidade" value={`${data.takerMunicipio}/${data.takerUf}`} />}
        </Section>

        <div style={{ borderTop: '1px solid var(--color-border)', margin: '16px 0' }} />

        <Section title={invoiceType === 'NFE' ? 'Mercadoria' : 'Serviço'}>
          <Row label="Descrição" value={data.serviceDesc} />
          {invoiceType === 'NFE' && (
            <>
              <Row label="CFOP" value={data.cfop} />
              <Row label="Natureza" value={data.naturezaOperacao} />
            </>
          )}
          {invoiceType === 'NFSE' && (
            <>
              <Row label="Item lista" value={data.itemListaServico} />
              <Row label="Insc. municipal" value={data.inscricaoMunicipal} />
              {f.city && <Row label="Município ISS" value={f.city} />}
            </>
          )}
          {data.cnaeCode && <Row label="CNAE" value={data.cnaeCode} />}
        </Section>

        <div style={{ borderTop: '1px solid var(--color-border)', margin: '16px 0' }} />

        <Section title="Valores">
          <Row label="Valor bruto" value={`R$ ${fmt(f.grossValue)}`} />
          {f.issValue > 0 && (
            <>
              <Row label={`ISS (${(f.issRate * 100).toFixed(1)}%)`} value={`R$ ${fmt(f.issValue)}`} />
              <Row label="Valor líquido" value={`R$ ${fmt(f.netValue)}`} />
            </>
          )}
          {f.retentionRequired && <Row label="Retenção ISS" value="Sim — pelo tomador" />}
        </Section>
      </div>

      {error && (
        <div
          style={{
            padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca',
            borderRadius: 8, fontSize: 14, color: 'var(--color-error)', marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          type="button"
          onClick={onBack}
          disabled={emitting}
          style={{
            flex: 1, padding: '11px 0', background: 'transparent',
            color: 'var(--color-muted)', border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)', fontSize: 15, cursor: 'pointer',
            opacity: emitting ? 0.5 : 1,
          }}
        >
          ← Voltar
        </button>
        <button
          onClick={onNext}
          disabled={emitting}
          style={{
            flex: 2, padding: '11px 0',
            background: emitting ? 'var(--color-muted)' : 'var(--color-success)',
            color: '#fff', border: 'none', borderRadius: 'var(--radius)',
            fontSize: 15, fontWeight: 600,
            cursor: emitting ? 'not-allowed' : 'pointer',
          }}
        >
          {emitting ? 'Emitindo...' : 'Emitir nota fiscal'}
        </button>
      </div>
    </div>
  );
}
