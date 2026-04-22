import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import { companiesApi } from '../../hooks/useCompanies';
import { CnpjLookup } from '../../types/company';
import { StepCnpj } from './steps/StepCnpj';
import { StepReview } from './steps/StepReview';
import { StepDone } from './steps/StepDone';

export type OnboardingData = {
  cnpj: string;
  name: string;
  tradeName: string;
  email: string;
  phone: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  ibgeCode: string;
};

const STEPS = ['CNPJ', 'Revisão', 'Pronto'];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [cnpjData, setCnpjData] = useState<CnpjLookup | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { reload } = useCompany();
  const navigate = useNavigate();

  const handleCnpjFound = (data: CnpjLookup) => {
    setCnpjData(data);
    setStep(1);
  };

  const handleSave = async (formData: OnboardingData) => {
    setSaving(true);
    setError('');
    try {
      await companiesApi.create({
        cnpj: formData.cnpj,
        name: formData.name,
        tradeName: formData.tradeName || undefined,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        street: formData.street || undefined,
        number: formData.number || undefined,
        complement: formData.complement || undefined,
        neighborhood: formData.neighborhood || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        zipCode: formData.zipCode || undefined,
        ibgeCode: formData.ibgeCode || undefined,
      });
      await reload();
      setStep(2);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(msg ?? 'Erro ao salvar empresa. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 16px',
      }}
    >
      {/* Logo */}
      <span style={{ fontWeight: 700, fontSize: 20, color: 'var(--color-primary)', marginBottom: 32 }}>
        MF Mei
      </span>

      {/* Stepper */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 40 }}>
        {STEPS.map((label, i) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 600,
                  background: i <= step ? 'var(--color-primary)' : 'var(--color-border)',
                  color: i <= step ? '#fff' : 'var(--color-muted)',
                  transition: 'background 0.2s',
                }}
              >
                {i < step ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 12, color: i <= step ? 'var(--color-primary)' : 'var(--color-muted)', fontWeight: i === step ? 600 : 400 }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                style={{
                  width: 60,
                  height: 2,
                  background: i < step ? 'var(--color-primary)' : 'var(--color-border)',
                  margin: '0 8px',
                  marginBottom: 22,
                  transition: 'background 0.2s',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Card */}
      <div
        style={{
          width: '100%',
          maxWidth: 520,
          background: 'var(--color-surface)',
          borderRadius: 12,
          boxShadow: '0 4px 24px 0 rgb(0 0 0 / 0.08)',
          padding: '36px 32px',
        }}
      >
        {step === 0 && <StepCnpj onFound={handleCnpjFound} />}
        {step === 1 && cnpjData && (
          <StepReview
            cnpjData={cnpjData}
            onBack={() => setStep(0)}
            onSave={handleSave}
            saving={saving}
            error={error}
          />
        )}
        {step === 2 && <StepDone onGo={() => navigate('/dashboard')} />}
      </div>
    </div>
  );
}
