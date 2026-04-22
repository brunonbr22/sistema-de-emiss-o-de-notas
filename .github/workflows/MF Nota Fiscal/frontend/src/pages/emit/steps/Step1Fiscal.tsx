import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { fiscalApi } from '../../../hooks/useInvoices';
import { FiscalCheckResult, WizardData } from '../../../types/invoice';
import { Company } from '../../../types/company';
import { FormField } from '../../../components/FormField';

const schema = z.object({
  cnaeCode: z.string().min(4, 'Informe o CNAE da atividade.'),
  grossValue: z
    .string()
    .min(1, 'Informe o valor.')
    .transform((v) => v.replace(',', '.'))
    .pipe(z.coerce.number().positive('Valor deve ser positivo.')),
  ibgeCode: z.string().optional(),
});

type FormData = z.input<typeof schema>;

interface Props {
  company: Company;
  initial: Partial<WizardData>;
  onNext: (data: Pick<WizardData, 'cnaeCode' | 'grossValue' | 'ibgeCode' | 'invoiceType' | 'fiscalResult'>) => void;
}

function fmt(n: number, decimals = 2) {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function Step1Fiscal({ company, initial, onNext }: Props) {
  const [result, setResult] = useState<FiscalCheckResult | null>(null);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      cnaeCode: initial.cnaeCode ?? '',
      grossValue: initial.grossValue ? String(initial.grossValue) : '',
      ibgeCode: initial.ibgeCode ?? company.ibgeCode ?? '',
    },
  });

  const cnaeCode = watch('cnaeCode');
  const grossValue = watch('grossValue');

  const onCheck = async (raw: FormData) => {
    setServerError('');
    setResult(null);
    try {
      const ibge = (raw.ibgeCode ?? company.ibgeCode ?? '').replace(/\D/g, '') || undefined;
      const res = await fiscalApi.check(company.id, {
        cnaeCode: raw.cnaeCode.trim(),
        grossValue: String(raw.grossValue as unknown as number),
        ibgeCode: ibge,
      });
      if (!res.cnaeAllowed) {
        setServerError(`CNAE ${raw.cnaeCode} não é permitido para MEI.`);
        return;
      }
      if (res.limitExceeded) {
        setServerError('Limite anual MEI excedido. Não é possível emitir mais notas este ano.');
        return;
      }
      setResult(res);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setServerError(msg ?? 'Erro ao consultar regras fiscais.');
    }
  };

  const handleConfirm = () => {
    if (!result) return;
    const ibge = (watch('ibgeCode') ?? company.ibgeCode ?? '').replace(/\D/g, '');
    onNext({
      cnaeCode: watch('cnaeCode').trim(),
      grossValue: result.grossValue,
      ibgeCode: ibge,
      invoiceType: result.invoiceType,
      fiscalResult: result,
    });
  };

  const usedPct = result
    ? Math.min(100, Math.round(((result.annualIssued + result.grossValue) / 81000) * 100))
    : 0;

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>Qual nota você vai emitir?</h2>
      <p style={{ color: 'var(--color-muted)', fontSize: 14, marginBottom: 28 }}>
        Informe o CNAE da atividade e o valor para determinarmos o tipo de nota automaticamente.
      </p>

      <form onSubmit={handleSubmit(onCheck)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <FormField
          label="CNAE da atividade"
          placeholder="ex: 6201-5/01"
          error={errors.cnaeCode?.message}
          {...register('cnaeCode')}
        />

        <FormField
          label="Valor bruto (R$)"
          placeholder="500,00"
          inputMode="decimal"
          error={errors.grossValue?.message}
          {...register('grossValue')}
        />

        <FormField
          label="Código IBGE do município (para NFS-e)"
          placeholder={company.ibgeCode ?? '7 dígitos'}
          error={errors.ibgeCode?.message}
          {...register('ibgeCode')}
        />

        {serverError && (
          <p style={{ fontSize: 14, color: 'var(--color-error)' }}>{serverError}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '11px 0',
            background: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius)',
            fontSize: 15,
            fontWeight: 600,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.7 : 1,
          }}
        >
          {isSubmitting ? 'Verificando...' : 'Verificar regras fiscais'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: 24, borderTop: '1px solid var(--color-border)', paddingTop: 20 }}>
          {/* Tipo de nota */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 700,
                background: result.invoiceType === 'NFE' ? '#eff6ff' : '#f0fdf4',
                color: result.invoiceType === 'NFE' ? 'var(--color-primary)' : 'var(--color-success)',
              }}
            >
              {result.invoiceType === 'NFE' ? 'NF-e' : 'NFS-e'}
            </span>
            <span style={{ fontSize: 14, color: 'var(--color-muted)' }}>{result.cnaeDescription}</span>
          </div>

          {/* Resumo financeiro */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px 16px',
              fontSize: 14,
              marginBottom: 16,
            }}
          >
            <Row label="Valor bruto" value={`R$ ${fmt(result.grossValue)}`} />
            {result.issValue > 0 && (
              <>
                <Row label={`ISS (${fmt(result.issRate * 100, 1)}%)`} value={`R$ ${fmt(result.issValue)}`} muted />
                <Row label="Valor líquido" value={`R$ ${fmt(result.netValue)}`} bold />
              </>
            )}
            {result.city && <Row label="Município" value={result.city} muted />}
            {result.retentionRequired && (
              <div style={{ gridColumn: '1/-1' }}>
                <span style={{ fontSize: 13, color: '#b45309', background: '#fef3c7', padding: '3px 8px', borderRadius: 4 }}>
                  ISS retido pelo tomador
                </span>
              </div>
            )}
          </div>

          {/* Barra de limite anual */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--color-muted)', marginBottom: 4 }}>
              <span>Limite anual MEI usado: R$ {fmt(result.annualIssued + result.grossValue)}</span>
              <span>R$ 81.000</span>
            </div>
            <div style={{ height: 6, background: 'var(--color-border)', borderRadius: 3, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${usedPct}%`,
                  background: result.limitWarning ? '#f59e0b' : 'var(--color-success)',
                  borderRadius: 3,
                  transition: 'width 0.4s',
                }}
              />
            </div>
            {result.limitWarning && (
              <p style={{ fontSize: 13, color: '#b45309', marginTop: 4 }}>
                Atenção: você atingiu mais de 80% do limite anual MEI.
              </p>
            )}
          </div>

          <button
            onClick={handleConfirm}
            style={{
              width: '100%',
              padding: '11px 0',
              background: 'var(--color-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius)',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Continuar →
          </button>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, muted, bold }: { label: string; value: string; muted?: boolean; bold?: boolean }) {
  return (
    <>
      <span style={{ color: 'var(--color-muted)' }}>{label}</span>
      <span style={{ fontWeight: bold ? 600 : 400, color: muted ? 'var(--color-muted)' : 'var(--color-text)' }}>
        {value}
      </span>
    </>
  );
}
