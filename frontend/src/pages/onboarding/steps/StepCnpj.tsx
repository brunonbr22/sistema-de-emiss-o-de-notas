import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { companiesApi } from '../../../hooks/useCompanies';
import { CnpjLookup } from '../../../types/company';
import { FormField } from '../../../components/FormField';

const schema = z.object({
  cnpj: z
    .string()
    .transform((v) => v.replace(/\D/g, ''))
    .pipe(z.string().length(14, 'CNPJ deve ter 14 dígitos.')),
});

type FormData = { cnpj: string };

interface Props {
  onFound: (data: CnpjLookup) => void;
}

function formatCnpj(value: string) {
  const d = value.replace(/\D/g, '').slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

export function StepCnpj({ onFound }: Props) {
  const [serverError, setServerError] = useState('');
  const [cnpjDisplay, setCnpjDisplay] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCnpj(e.target.value);
    setCnpjDisplay(formatted);
    setValue('cnpj', formatted);
  };

  const onSubmit = async () => {
    setServerError('');
    try {
      const data = await companiesApi.lookupCnpj(cnpjDisplay);
      onFound(data);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setServerError(msg ?? 'CNPJ não encontrado ou serviço indisponível.');
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Qual é o seu CNPJ?</h2>
      <p style={{ color: 'var(--color-muted)', fontSize: 14, marginBottom: 28 }}>
        Vamos buscar seus dados automaticamente na Receita Federal.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <FormField
          label="CNPJ"
          type="text"
          inputMode="numeric"
          placeholder="00.000.000/0001-00"
          value={cnpjDisplay}
          error={errors.cnpj?.message}
          {...register('cnpj', {
            onChange: handleChange,
          })}
          onChange={handleChange}
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
          {isSubmitting ? 'Buscando...' : 'Buscar dados'}
        </button>
      </form>
    </div>
  );
}
