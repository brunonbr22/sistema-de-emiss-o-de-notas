import { useEffect, useState, useCallback } from 'react';
import { invoicesApi } from '../../../hooks/useInvoices';
import { EmitResponse, Invoice } from '../../../types/invoice';

interface Props {
  invoiceType: 'NFE' | 'NFSE';
  initialResponse: EmitResponse;
  onEmitNew: () => void;
  onGoToDashboard: () => void;
}

function statusLabel(status: string): { text: string; color: string; bg: string } {
  switch (status) {
    case 'ISSUED':
    case 'autorizado':
      return { text: 'Autorizada', color: 'var(--color-success)', bg: '#f0fdf4' };
    case 'PENDING':
    case 'processando_autorizacao':
      return { text: 'Processando...', color: '#92400e', bg: '#fffbeb' };
    case 'REJECTED':
    case 'erro_autorizacao':
      return { text: 'Rejeitada', color: 'var(--color-error)', bg: '#fef2f2' };
    case 'CANCELED':
    case 'cancelado':
      return { text: 'Cancelada', color: 'var(--color-muted)', bg: 'var(--color-bg)' };
    default:
      return { text: status, color: 'var(--color-text)', bg: 'var(--color-bg)' };
  }
}

export function StepFeedback({ invoiceType, initialResponse, onEmitNew, onGoToDashboard }: Props) {
  const [invoice, setInvoice] = useState<Invoice>(initialResponse.invoice);
  const [focusStatus, setFocusStatus] = useState(
    initialResponse.focusNfe ?? initialResponse.focusNfse,
  );
  const [polling, setPolling] = useState(
    initialResponse.invoice.status === 'PENDING',
  );

  const checkStatus = useCallback(async () => {
    try {
      const res = invoiceType === 'NFE'
        ? await invoicesApi.getNfeStatus(invoice.id)
        : await invoicesApi.getNfseStatus(invoice.id);

      setInvoice(res.invoice);
      setFocusStatus(res.focusNfe ?? res.focusNfse);

      if (res.invoice.status !== 'PENDING') {
        setPolling(false);
      }
    } catch {
      setPolling(false);
    }
  }, [invoice.id, invoiceType]);

  useEffect(() => {
    if (!polling) return;
    const id = setInterval(checkStatus, 4000);
    return () => clearInterval(id);
  }, [polling, checkStatus]);

  const { text: statusText, color: statusColor, bg: statusBg } = statusLabel(invoice.status);
  const isIssued = invoice.status === 'ISSUED';
  const isPending = invoice.status === 'PENDING';
  const isError = invoice.status === 'REJECTED';

  const errors = focusStatus?.erros ?? [];
  const typeLabel = invoiceType === 'NFE' ? 'NF-e' : 'NFS-e';

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Status icon */}
      <div
        style={{
          width: 72, height: 72, borderRadius: '50%', margin: '0 auto 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32,
          background: isIssued ? '#f0fdf4' : isPending ? '#fffbeb' : '#fef2f2',
        }}
      >
        {isIssued ? '✓' : isPending ? '⏳' : '✕'}
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 6 }}>
        {isIssued ? `${typeLabel} emitida com sucesso!` : isPending ? 'Aguardando autorização...' : `Erro na emissão da ${typeLabel}`}
      </h2>

      <span
        style={{
          display: 'inline-block', padding: '3px 14px', borderRadius: 20,
          fontSize: 13, fontWeight: 600, color: statusColor, background: statusBg,
          marginBottom: 24,
        }}
      >
        {statusText}
      </span>

      {/* Details */}
      <div
        style={{
          background: 'var(--color-bg)', border: '1px solid var(--color-border)',
          borderRadius: 10, padding: '16px 20px', textAlign: 'left', marginBottom: 24,
          display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14,
        }}
      >
        {invoice.number && (
          <Row label="Número" value={invoice.number} />
        )}
        {invoice.accessKey && (
          <Row label={invoiceType === 'NFE' ? 'Chave de acesso' : 'Cód. verificação'} value={invoice.accessKey} mono />
        )}
        {invoice.issuedAt && (
          <Row label="Data emissão" value={new Date(invoice.issuedAt).toLocaleString('pt-BR')} />
        )}
        <Row label="Protocolo interno" value={invoice.id} mono />
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div
          style={{
            background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8,
            padding: '12px 16px', textAlign: 'left', marginBottom: 20,
          }}
        >
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-error)', marginBottom: 6 }}>Erros retornados pela SEFAZ:</p>
          {errors.map((e, i) => (
            <p key={i} style={{ fontSize: 13, color: 'var(--color-error)' }}>
              [{e.codigo}] {e.mensagem}
            </p>
          ))}
        </div>
      )}

      {/* Download buttons */}
      {isIssued && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <a
            href={`/api/v1/invoices/${invoiceType.toLowerCase()}/${invoice.id}/xml`}
            download
            style={{
              flex: 1, padding: '10px 0', textAlign: 'center', textDecoration: 'none',
              border: '1px solid var(--color-border)', borderRadius: 'var(--radius)',
              fontSize: 14, color: 'var(--color-text)', background: 'var(--color-surface)',
            }}
          >
            Baixar XML
          </a>
          <a
            href={`/api/v1/invoices/${invoiceType === 'NFE' ? 'nfe' : 'nfse'}/${invoice.id}/${invoiceType === 'NFE' ? 'danfe' : 'pdf'}`}
            download
            style={{
              flex: 1, padding: '10px 0', textAlign: 'center', textDecoration: 'none',
              border: '1px solid var(--color-border)', borderRadius: 'var(--radius)',
              fontSize: 14, color: 'var(--color-text)', background: 'var(--color-surface)',
            }}
          >
            {invoiceType === 'NFE' ? 'Baixar DANFE' : 'Baixar PDF'}
          </a>
        </div>
      )}

      {isPending && (
        <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 16 }}>
          Verificando status a cada 4 segundos...
        </p>
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={onGoToDashboard}
          style={{
            flex: 1, padding: '11px 0', background: 'transparent',
            color: 'var(--color-muted)', border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius)', fontSize: 15, cursor: 'pointer',
          }}
        >
          Ir ao Dashboard
        </button>
        <button
          onClick={onEmitNew}
          style={{
            flex: 1, padding: '11px 0', background: 'var(--color-primary)',
            color: '#fff', border: 'none', borderRadius: 'var(--radius)',
            fontSize: 15, fontWeight: 600, cursor: 'pointer',
          }}
        >
          Emitir outra nota
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
      <span style={{ color: 'var(--color-muted)', minWidth: 130, flexShrink: 0 }}>{label}</span>
      <span style={{ fontFamily: mono ? 'monospace' : 'inherit', fontSize: mono ? 12 : 14, wordBreak: 'break-all' }}>
        {value}
      </span>
    </div>
  );
}
