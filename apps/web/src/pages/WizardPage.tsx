import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  type: z.enum(['NFE', 'NFSE']),
  customerName: z.string().min(2),
  customerTaxId: z.string().min(11),
  itemDescription: z.string().min(3),
  totalAmount: z.coerce.number().positive(),
});

type FormValues = z.infer<typeof schema>;

const steps = ['Tipo de nota', 'Cliente', 'Produto ou serviço', 'Resumo'];

export function WizardPage() {
  const [step, setStep] = useState(0);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'NFSE' },
  });

  const values = watch();
  const summary = useMemo(() => ({
    suggestion: values.type === 'NFSE' ? 'Sugerimos prestação de serviço por MEI no padrão nacional.' : 'Sugerimos venda de mercadoria por MEI com CFOP 5102.',
  }), [values.type]);

  return (
    <div className="stack large-gap">
      <section className="header-row">
        <div>
          <p className="eyebrow">Wizard de emissão</p>
          <h2>Emita em etapas simples</h2>
          <p className="muted">Sem termos difíceis. A cada etapa mostramos só o necessário para seu caso.</p>
        </div>
      </section>

      <div className="steps">
        {steps.map((label, index) => (
          <div key={label} className={`step ${index <= step ? 'active' : ''}`}>{index + 1}. {label}</div>
        ))}
      </div>

      <form className="card stack" onSubmit={handleSubmit(() => setStep(3))}>
        {step === 0 && (
          <>
            <label>Que tipo de nota você precisa?</label>
            <select {...register('type')}>
              <option value="NFE">NF-e para mercadoria</option>
              <option value="NFSE">NFS-e padrão nacional para serviço</option>
            </select>
          </>
        )}

        {step === 1 && (
          <>
            <label>Nome do cliente</label>
            <input {...register('customerName')} placeholder="Ex.: Padaria Sol" />
            <label>CPF ou CNPJ do cliente</label>
            <input {...register('customerTaxId')} placeholder="Digite o documento" />
          </>
        )}

        {step === 2 && (
          <>
            <label>O que você está vendendo ou prestando?</label>
            <input {...register('itemDescription')} placeholder="Descreva o item ou serviço" />
            <label>Valor total</label>
            <input {...register('totalAmount')} placeholder="0,00" />
          </>
        )}

        {step === 3 && (
          <div className="summary-box">
            <h3>Resumo inteligente</h3>
            <p>{summary.suggestion}</p>
            <ul>
              <li>Cliente: {values.customerName || 'Não informado'}</li>
              <li>Documento: {values.customerTaxId || 'Não informado'}</li>
              <li>Descrição: {values.itemDescription || 'Não informado'}</li>
              <li>Valor: R$ {values.totalAmount?.toFixed?.(2) || '0,00'}</li>
            </ul>
            <button className="primary-button" type="submit">Emitir nota</button>
          </div>
        )}

        {Object.keys(errors).length > 0 && <p className="error-text">Revise os campos destacados antes de continuar.</p>}

        <div className="wizard-actions">
          <button className="secondary-button" type="button" disabled={step === 0} onClick={() => setStep((current) => Math.max(current - 1, 0))}>Voltar</button>
          {step < 3 && <button className="primary-button" type="button" onClick={() => setStep((current) => Math.min(current + 1, 3))}>Continuar</button>}
        </div>
      </form>
    </div>
  );
}
