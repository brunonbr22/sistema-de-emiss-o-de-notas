import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { WizardData } from '../../../types/invoice';
import { FormField } from '../../../components/FormField';

const schema = z.object({
  takerDocument: z
    .string()
    .transform((v) => v.replace(/\D/g, ''))
    .pipe(
      z.string().refine((v) => v.length === 11 || v.length === 14, {
        message: 'Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.',
      }),
    ),
  takerName: z.string().min(2, 'Informe o nome/razão social.'),
  takerEmail: z.string().email('E-mail inválido.').or(z.literal('')).optional(),
  takerLogradouro: z.string().optional(),
  takerNumero: z.string().optional(),
  takerComplemento: z.string().optional(),
  takerBairro: z.string().optional(),
  takerMunicipio: z.string().optional(),
  takerUf: z.string().max(2).optional(),
  takerCep: z.string().optional(),
  takerCodigoMunicipio: z.string().optional(),
});

type FormData = z.input<typeof schema>;

interface Props {
  invoiceType: 'NFE' | 'NFSE';
  initial: Partial<WizardData>;
  onNext: (data: Pick<WizardData, 'takerDocument' | 'takerName' | 'takerEmail' | 'takerLogradouro' | 'takerNumero' | 'takerComplemento' | 'takerBairro' | 'takerMunicipio' | 'takerUf' | 'takerCep' | 'takerCodigoMunicipio'>) => void;
  onBack: () => void;
}

function formatDoc(value: string) {
  const d = value.replace(/\D/g, '');
  if (d.length <= 11) {
    return d.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  return d
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

export function Step2Tomador({ invoiceType, initial, onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      takerDocument: initial.takerDocument ?? '',
      takerName: initial.takerName ?? '',
      takerEmail: initial.takerEmail ?? '',
      takerLogradouro: initial.takerLogradouro ?? '',
      takerNumero: initial.takerNumero ?? '',
      takerComplemento: initial.takerComplemento ?? '',
      takerBairro: initial.takerBairro ?? '',
      takerMunicipio: initial.takerMunicipio ?? '',
      takerUf: initial.takerUf ?? '',
      takerCep: initial.takerCep ?? '',
      takerCodigoMunicipio: initial.takerCodigoMunicipio ?? '',
    },
  });

  const [docDisplay, setDocDisplay] = [watch('takerDocument'), (v: string) => setValue('takerDocument', v)];

  const onSubmit = (data: FormData) => {
    onNext({
      takerDocument: data.takerDocument as unknown as string,
      takerName: data.takerName,
      takerEmail: data.takerEmail ?? '',
      takerLogradouro: data.takerLogradouro ?? '',
      takerNumero: data.takerNumero ?? '',
      takerComplemento: data.takerComplemento ?? '',
      takerBairro: data.takerBairro ?? '',
      takerMunicipio: data.takerMunicipio ?? '',
      takerUf: data.takerUf ?? '',
      takerCep: data.takerCep ?? '',
      takerCodigoMunicipio: data.takerCodigoMunicipio ?? '',
    });
  };

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>Dados do tomador</h2>
      <p style={{ color: 'var(--color-muted)', fontSize: 14, marginBottom: 24 }}>
        Quem está recebendo este serviço ou mercadoria?
      </p>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <FormField
          label="CPF / CNPJ do tomador"
          placeholder="000.000.000-00"
          inputMode="numeric"
          value={docDisplay}
          error={errors.takerDocument?.message}
          {...register('takerDocument', {
            onChange: (e) => setDocDisplay(formatDoc(e.target.value)),
          })}
          onChange={(e) => setDocDisplay(formatDoc(e.target.value))}
        />

        <FormField
          label="Nome / Razão social"
          placeholder="Nome completo ou razão social"
          error={errors.takerName?.message}
          {...register('takerName')}
        />

        <FormField
          label="E-mail (opcional)"
          type="email"
          placeholder="tomador@exemplo.com.br"
          error={errors.takerEmail?.message}
          {...register('takerEmail')}
        />

        <details style={{ marginTop: 4 }}>
          <summary style={{ fontSize: 14, color: 'var(--color-muted)', cursor: 'pointer', userSelect: 'none', marginBottom: 12 }}>
            Endereço do tomador (opcional)
          </summary>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10 }}>
              <FormField label="Logradouro" {...register('takerLogradouro')} />
              <div style={{ width: 80 }}><FormField label="Número" {...register('takerNumero')} /></div>
            </div>
            <FormField label="Complemento" {...register('takerComplemento')} />
            <FormField label="Bairro" {...register('takerBairro')} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px', gap: 10 }}>
              <FormField label="Cidade" {...register('takerMunicipio')} />
              <FormField label="UF" maxLength={2} {...register('takerUf')} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <FormField label="CEP" {...register('takerCep')} />
              {invoiceType === 'NFSE' && (
                <FormField label="Cód. IBGE município" placeholder="7 dígitos" {...register('takerCodigoMunicipio')} />
              )}
            </div>
          </div>
        </details>

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              flex: 1, padding: '11px 0', background: 'transparent',
              color: 'var(--color-muted)', border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius)', fontSize: 15, cursor: 'pointer',
            }}
          >
            ← Voltar
          </button>
          <button
            type="submit"
            style={{
              flex: 2, padding: '11px 0', background: 'var(--color-primary)',
              color: '#fff', border: 'none', borderRadius: 'var(--radius)',
              fontSize: 15, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Continuar →
          </button>
        </div>
      </form>
    </div>
  );
}
