import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CnpjLookup } from '../../../types/company';
import { OnboardingData } from '../OnboardingPage';
import { FormField } from '../../../components/FormField';

const schema = z.object({
  cnpj: z.string(),
  name: z.string().min(2, 'Informe o nome da empresa.'),
  tradeName: z.string().optional().default(''),
  email: z.union([z.string().email('E-mail inválido.'), z.literal('')]).optional().default(''),
  phone: z.string().optional().default(''),
  street: z.string().optional().default(''),
  number: z.string().optional().default(''),
  complement: z.string().optional().default(''),
  neighborhood: z.string().optional().default(''),
  city: z.string().optional().default(''),
  state: z.string().optional().default(''),
  zipCode: z.string().optional().default(''),
  ibgeCode: z.string().optional().default(''),
});

interface Props {
  cnpjData: CnpjLookup;
  onBack: () => void;
  onSave: (data: OnboardingData) => void;
  saving: boolean;
  error: string;
}

export function StepReview({ cnpjData, onBack, onSave, saving, error }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<OnboardingData>({
    resolver: zodResolver(schema),
    defaultValues: {
      cnpj: cnpjData.cnpj,
      name: cnpjData.razaoSocial ?? '',
      tradeName: cnpjData.nomeFantasia ?? '',
      email: cnpjData.email ?? '',
      phone: cnpjData.telefone ?? '',
      street: cnpjData.logradouro ?? '',
      number: cnpjData.numero ?? '',
      complement: cnpjData.complemento ?? '',
      neighborhood: cnpjData.bairro ?? '',
      city: cnpjData.municipio ?? '',
      state: cnpjData.uf ?? '',
      zipCode: cnpjData.cep ?? '',
      ibgeCode: cnpjData.ibgeCode ?? '',
    },
  });

  const fieldStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 } as const;

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Confirme seus dados</h2>
      <p style={{ color: 'var(--color-muted)', fontSize: 14, marginBottom: 24 }}>
        Preenchemos com o que encontramos. Você pode editar antes de continuar.
      </p>

      {cnpjData.situacao && cnpjData.situacao.toUpperCase() !== 'ATIVA' && (
        <div style={{
          background: '#fef9c3', border: '1px solid #fbbf24', borderRadius: 8,
          padding: '10px 14px', fontSize: 13, marginBottom: 20, color: '#92400e',
        }}>
          Atenção: situação cadastral na Receita Federal é <strong>{cnpjData.situacao}</strong>.
        </div>
      )}

      <form onSubmit={handleSubmit(onSave)} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <input type="hidden" {...register('cnpj')} />

        <FormField label="Razão Social" error={errors.name?.message} {...register('name')} />
        <FormField label="Nome Fantasia" error={errors.tradeName?.message} {...register('tradeName')} />

        <div style={fieldStyle}>
          <FormField label="E-mail" type="email" error={errors.email?.message} {...register('email')} />
          <FormField label="Telefone" error={errors.phone?.message} {...register('phone')} />
        </div>

        <div style={fieldStyle}>
          <div style={{ gridColumn: '1 / -1' }}>
            <FormField label="Logradouro" error={errors.street?.message} {...register('street')} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
          <FormField label="Número" error={errors.number?.message} {...register('number')} />
          <FormField label="Complemento" error={errors.complement?.message} {...register('complement')} />
        </div>

        <div style={fieldStyle}>
          <FormField label="Bairro" error={errors.neighborhood?.message} {...register('neighborhood')} />
          <FormField label="CEP" error={errors.zipCode?.message} {...register('zipCode')} />
        </div>

        <div style={fieldStyle}>
          <FormField label="Cidade" error={errors.city?.message} {...register('city')} />
          <FormField label="UF" error={errors.state?.message} {...register('state')} />
        </div>

        {error && (
          <p style={{ fontSize: 14, color: 'var(--color-error)' }}>{error}</p>
        )}

        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button
            type="button"
            onClick={onBack}
            disabled={saving}
            style={{
              flex: 1, padding: '11px 0', border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)', background: 'transparent',
              fontSize: 15, cursor: 'pointer',
            }}
          >
            Voltar
          </button>
          <button
            type="submit"
            disabled={saving}
            style={{
              flex: 2, padding: '11px 0', background: 'var(--color-primary)',
              color: '#fff', border: 'none', borderRadius: 'var(--radius)',
              fontSize: 15, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? 'Salvando...' : 'Confirmar e continuar'}
          </button>
        </div>
      </form>
    </div>
  );
}
