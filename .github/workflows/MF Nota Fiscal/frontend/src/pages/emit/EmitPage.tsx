import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { invoicesApi } from '../../hooks/useInvoices';
import { WizardData, EmitResponse } from '../../types/invoice';
import { Step1Fiscal } from './steps/Step1Fiscal';
import { Step2Tomador } from './steps/Step2Tomador';
import { Step3Servico } from './steps/Step3Servico';
import { Step4Revisao } from './steps/Step4Revisao';
import { StepFeedback } from './steps/StepFeedback';

const STEP_LABELS = ['Tipo de nota', 'Tomador', 'Serviço', 'Revisão'];

export default function EmitPage() {
  const { activeCompany } = useCompany();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<WizardData>>({});
  const [emitting, setEmitting] = useState(false);
  const [emitError, setEmitError] = useState('');
  const [response, setResponse] = useState<EmitResponse | null>(null);

  const merge = (update: Partial<WizardData>) => setData((prev) => ({ ...prev, ...update }));

  const handleEmit = async () => {
    if (!activeCompany || !data.invoiceType || !data.fiscalResult) return;
    setEmitting(true);
    setEmitError('');

    try {
      let res: EmitResponse;

      if (data.invoiceType === 'NFE') {
        // Save NFS-e config so the backend has it (upsert is idempotent)
        res = await invoicesApi.emitNfe(activeCompany.id, {
          takerDocument: data.takerDocument!,
          takerName: data.takerName!,
          takerEmail: data.takerEmail || undefined,
          serviceDesc: data.serviceDesc!,
          cfop: data.cfop!,
          grossValue: data.fiscalResult.grossValue,
          cnaeCode: data.cnaeCode!,
          naturezaOperacao: data.naturezaOperacao || undefined,
          informacoesAdicionais: data.informacoesAdicionais || undefined,
          takerAddress: buildAddress('nfe', data),
        });
      } else {
        // NFS-e: upsert config before emitting
        if (data.inscricaoMunicipal && data.itemListaServico) {
          await invoicesApi.upsertNfseConfig(activeCompany.id, {
            ibgeCode: data.ibgeCode!,
            inscricaoMunicipal: data.inscricaoMunicipal,
            itemListaServico: data.itemListaServico,
            codigoTributacaoMunicipio: data.codigoTributacaoMunicipio || undefined,
          });
        }
        res = await invoicesApi.emitNfse(activeCompany.id, {
          takerDocument: data.takerDocument!,
          takerName: data.takerName!,
          takerEmail: data.takerEmail || undefined,
          serviceDesc: data.serviceDesc!,
          ibgeCode: data.ibgeCode!,
          cnaeCode: data.cnaeCode!,
          grossValue: data.fiscalResult.grossValue,
          itemListaServico: data.itemListaServico || undefined,
          codigoTributacaoMunicipio: data.codigoTributacaoMunicipio || undefined,
          informacoesAdicionais: data.informacoesAdicionais || undefined,
          takerAddress: buildAddress('nfse', data),
        });
      }

      setResponse(res);
      setStep(4);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
      setEmitError(Array.isArray(msg) ? msg.join(' ') : (msg ?? 'Erro ao emitir nota fiscal.'));
    } finally {
      setEmitting(false);
    }
  };

  const resetWizard = () => {
    setStep(0);
    setData({});
    setResponse(null);
    setEmitError('');
  };

  if (!activeCompany) {
    return (
      <PageWrapper>
        <div style={{ textAlign: 'center', color: 'var(--color-muted)', paddingTop: 40 }}>
          Selecione uma empresa para emitir notas.
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--color-muted)', fontSize: 14, padding: 0,
          }}
        >
          ← Dashboard
        </button>
        <span style={{ color: 'var(--color-border)' }}>|</span>
        <span style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: 16 }}>Emitir nota fiscal</span>
      </div>

      {/* Stepper — hidden on feedback step */}
      {step < 4 && (
        <div style={{ display: 'flex', gap: 0, marginBottom: 36, justifyContent: 'center' }}>
          {STEP_LABELS.map((label, i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div
                  style={{
                    width: 30, height: 30, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 600,
                    background: i < step ? 'var(--color-primary)' : i === step ? 'var(--color-primary)' : 'var(--color-border)',
                    color: i <= step ? '#fff' : 'var(--color-muted)',
                    transition: 'background 0.2s',
                  }}
                >
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 11, color: i === step ? 'var(--color-primary)' : 'var(--color-muted)', fontWeight: i === step ? 600 : 400, whiteSpace: 'nowrap' }}>
                  {label}
                </span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div
                  style={{
                    width: 48, height: 2, margin: '0 6px', marginBottom: 22,
                    background: i < step ? 'var(--color-primary)' : 'var(--color-border)',
                    transition: 'background 0.2s',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Card */}
      <div
        style={{
          width: '100%', maxWidth: 560, margin: '0 auto',
          background: 'var(--color-surface)', borderRadius: 12,
          boxShadow: '0 4px 24px 0 rgb(0 0 0 / 0.08)', padding: '32px 28px',
        }}
      >
        {step === 0 && (
          <Step1Fiscal
            company={activeCompany}
            initial={data}
            onNext={(update) => { merge(update); setStep(1); }}
          />
        )}
        {step === 1 && data.invoiceType && (
          <Step2Tomador
            invoiceType={data.invoiceType}
            initial={data}
            onNext={(update) => { merge(update); setStep(2); }}
            onBack={() => setStep(0)}
          />
        )}
        {step === 2 && data.invoiceType && (
          <Step3Servico
            invoiceType={data.invoiceType}
            initial={data}
            onNext={(update) => { merge(update); setStep(3); }}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && data.invoiceType && data.fiscalResult && (
          <Step4Revisao
            data={data as WizardData}
            company={activeCompany}
            onNext={handleEmit}
            onBack={() => setStep(2)}
            emitting={emitting}
            error={emitError}
          />
        )}
        {step === 4 && response && data.invoiceType && (
          <StepFeedback
            invoiceType={data.invoiceType}
            initialResponse={response}
            onEmitNew={resetWizard}
            onGoToDashboard={() => navigate('/dashboard')}
          />
        )}
      </div>
    </PageWrapper>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', padding: '32px 16px' }}>
      {children}
    </div>
  );
}

function buildAddress(type: 'nfe' | 'nfse', data: Partial<WizardData>) {
  const hasAny = data.takerLogradouro || data.takerMunicipio || data.takerCep;
  if (!hasAny) return undefined;

  if (type === 'nfe') {
    return {
      logradouro: data.takerLogradouro || undefined,
      numero: data.takerNumero || undefined,
      bairro: data.takerBairro || undefined,
      municipio: data.takerMunicipio || undefined,
      uf: data.takerUf || undefined,
      cep: data.takerCep || undefined,
    };
  }
  return {
    logradouro: data.takerLogradouro || undefined,
    numero: data.takerNumero || undefined,
    complemento: data.takerComplemento || undefined,
    bairro: data.takerBairro || undefined,
    codigoMunicipio: data.takerCodigoMunicipio || undefined,
    uf: data.takerUf || undefined,
    cep: data.takerCep || undefined,
  };
}
