import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { WizardData } from '../../../types/invoice';
import { FormField } from '../../../components/FormField';

const nfeSchema = z.object({
  serviceDesc: z.string().min(3, 'Descreva o produto/serviço.'),
  cfop: z.string().length(4, 'CFOP deve ter 4 dígitos.').regex(/^\d{4}$/, 'Somente números.'),
  naturezaOperacao: z.string().min(3, 'Informe a natureza da operação.'),
  informacoesAdicionais: z.string().optional(),
  inscricaoMunicipal: z.string().optional(),
  itemListaServico: z.string().optional(),
  codigoTributacaoMunicipio: z.string().optional(),
});

const nfseSchema = z.object({
  serviceDesc: z.string().min(3, 'Descreva o serviço prestado.'),
  inscricaoMunicipal: z.string().min(1, 'Informe a inscrição municipal.'),
  itemListaServico: z.string().min(1, 'Informe o item da lista de serviços.'),
  codigoTributacaoMunicipio: z.string().optional(),
  informacoesAdicionais: z.string().optional(),
  cfop: z.string().optional(),
  naturezaOperacao: z.string().optional(),
});

type FormData = z.infer<typeof nfeSchema>;

interface Props {
  invoiceType: 'NFE' | 'NFSE';
  initial: Partial<WizardData>;
  onNext: (data: Pick<WizardData, 'serviceDesc' | 'cfop' | 'naturezaOperacao' | 'inscricaoMunicipal' | 'itemListaServico' | 'codigoTributacaoMunicipio' | 'informacoesAdicionais'>) => void;
  onBack: () => void;
}

export function Step3Servico({ invoiceType, initial, onNext, onBack }: Props) {
  const schema = invoiceType === 'NFE' ? nfeSchema : nfseSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      serviceDesc: initial.serviceDesc ?? '',
      cfop: initial.cfop ?? '5102',
      naturezaOperacao: initial.naturezaOperacao ?? 'Venda de mercadoria',
      inscricaoMunicipal: initial.inscricaoMunicipal ?? '',
      itemListaServico: initial.itemListaServico ?? '',
      codigoTributacaoMunicipio: initial.codigoTributacaoMunicipio ?? '',
      informacoesAdicionais: initial.informacoesAdicionais ?? '',
    },
  });

  const onSubmit = (data: FormData) => {
    onNext({
      serviceDesc: data.serviceDesc,
      cfop: data.cfop ?? '',
      naturezaOperacao: data.naturezaOperacao ?? '',
      inscricaoMunicipal: data.inscricaoMunicipal ?? '',
      itemListaServico: data.itemListaServico ?? '',
      codigoTributacaoMunicipio: data.codigoTributacaoMunicipio ?? '',
      informacoesAdicionais: data.informacoesAdicionais ?? '',
    });
  };

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>
        {invoiceType === 'NFE' ? 'Dados da mercadoria' : 'Dados do serviço'}
      </h2>
      <p style={{ color: 'var(--color-muted)', fontSize: 14, marginBottom: 24 }}>
        {invoiceType === 'NFE'
          ? 'Descreva a mercadoria e informe o CFOP.'
          : 'Descreva o serviço e informe os dados do município.'}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ fontSize: 14, fontWeight: 500, display: 'block', marginBottom: 4 }}>
            {invoiceType === 'NFE' ? 'Descrição da mercadoria' : 'Descrição do serviço'}
          </label>
          <textarea
            rows={3}
            placeholder={invoiceType === 'NFE' ? 'Venda de produto X...' : 'Desenvolvimento de software...'}
            style={{
              width: '100%', padding: '10px 12px',
              border: `1px solid ${errors.serviceDesc ? 'var(--color-error)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius)', fontSize: 15, resize: 'vertical', fontFamily: 'inherit',
            }}
            {...register('serviceDesc')}
          />
          {errors.serviceDesc && (
            <span style={{ fontSize: 13, color: 'var(--color-error)' }}>{errors.serviceDesc.message}</span>
          )}
        </div>

        {invoiceType === 'NFE' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 10 }}>
              <FormField
                label="CFOP"
                placeholder="5102"
                inputMode="numeric"
                maxLength={4}
                error={errors.cfop?.message}
                {...register('cfop')}
              />
              <FormField
                label="Natureza da operação"
                placeholder="Venda de mercadoria"
                error={errors.naturezaOperacao?.message}
                {...register('naturezaOperacao')}
              />
            </div>
            <div
              style={{
                fontSize: 13, color: 'var(--color-muted)', background: '#f8fafc',
                border: '1px solid var(--color-border)', borderRadius: 6, padding: '8px 12px',
              }}
            >
              CFOPs comuns: <strong>5102</strong> (venda dentro do estado) · <strong>6102</strong> (venda fora do estado) · <strong>5933</strong> (serviço tributado pelo ISS)
            </div>
          </>
        )}

        {invoiceType === 'NFSE' && (
          <>
            <FormField
              label="Inscrição municipal do prestador"
              placeholder="Número de inscrição na prefeitura"
              error={errors.inscricaoMunicipal?.message}
              {...register('inscricaoMunicipal')}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <FormField
                label="Item lista de serviços"
                placeholder="ex: 01.01"
                error={errors.itemListaServico?.message}
                {...register('itemListaServico')}
              />
              <FormField
                label="Cód. tributação município (opcional)"
                placeholder="ex: 1401"
                {...register('codigoTributacaoMunicipio')}
              />
            </div>
          </>
        )}

        <div>
          <label style={{ fontSize: 14, fontWeight: 500, display: 'block', marginBottom: 4 }}>
            Informações adicionais (opcional)
          </label>
          <textarea
            rows={2}
            placeholder="Informações complementares para o fisco..."
            style={{
              width: '100%', padding: '10px 12px',
              border: '1px solid var(--color-border)', borderRadius: 'var(--radius)',
              fontSize: 15, resize: 'vertical', fontFamily: 'inherit',
            }}
            {...register('informacoesAdicionais')}
          />
        </div>

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
