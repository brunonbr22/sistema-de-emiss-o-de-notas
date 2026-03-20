import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  customerTaxId: z.string().min(11),
  customerName: z.string().min(2),
  itemDescription: z.string().min(3),
  operationType: z.enum(['COMMERCE', 'SERVICE']),
  totalAmount: z.coerce.number().positive(),
});

type FormValues = z.infer<typeof schema>;

const steps = ['Para quem foi a venda?', 'O que foi vendido?', 'Revisão', 'Emitir agora'];

export function WizardPage() {
  const [step, setStep] = useState(0);
  const [emitted, setEmitted] = useState(false);
  const { register, watch, trigger, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { operationType: 'SERVICE' },
  });

  const values = watch();
  const summary = useMemo(() => ({
    invoiceType: values.operationType === 'COMMERCE' ? 'NF-e' : 'NFS-e padrão nacional',
    suggestion: values.operationType === 'COMMERCE'
      ? 'Sugerimos venda de mercadoria por MEI com preenchimento simplificado.'
      : 'Sugerimos prestação de serviço por MEI no padrão nacional.',
  }), [values.operationType]);

  async function nextStep() {
    if (step === 0) {
      const valid = await trigger(['customerTaxId', 'customerName']);
      if (!valid) return;
    }

    if (step === 1) {
      const valid = await trigger(['itemDescription', 'operationType', 'totalAmount']);
      if (!valid) return;
    }

    setStep((current) => Math.min(current + 1, 3));
  }

  return (
    <div className="stack large-gap">
      <section className="header-row">
        <div>
          <p className="eyebrow">Wizard de emissão</p>
          <h2>Emita sua nota em 4 passos</h2>
          <p className="muted">Primeiro cliente, depois item, depois revisão e por último emissão com status e XML.</p>
        </div>
      </section>

      <div className="steps">
        {steps.map((label, index) => (
          <div key={label} className={`step ${index <= step ? 'active' : ''}`}>{index + 1}. {label}</div>
        ))}
      </div>

      <div className="card stack">
        {step === 0 && (
          <>
            <h3>Etapa 1: para quem foi a venda?</h3>
            <label>CPF ou CNPJ</label>
            <input {...register('customerTaxId')} placeholder="Digite o documento do cliente" />
            <label>Nome</label>
            <input {...register('customerName')} placeholder="Ex.: Padaria Sol" />
          </>
        )}

        {step === 1 && (
          <>
            <h3>Etapa 2: o que foi vendido?</h3>
            <label>Descrição</label>
            <input {...register('itemDescription')} placeholder="Ex.: Criação de identidade visual" />
            <label>Tipo da operação</label>
            <select {...register('operationType')}>
              <option value="SERVICE">Serviço</option>
              <option value="COMMERCE">Comércio</option>
            </select>
            <label>Valor</label>
            <input {...register('totalAmount')} placeholder="0,00" />
          </>
        )}

        {step === 2 && (
          <div className="summary-box">
            <h3>Etapa 3: revisão</h3>
            <p>{summary.suggestion}</p>
            <ul>
              <li>Tipo de nota: {summary.invoiceType}</li>
              <li>Cliente: {values.customerName || 'Não informado'}</li>
              <li>Documento: {values.customerTaxId || 'Não informado'}</li>
              <li>Descrição: {values.itemDescription || 'Não informado'}</li>
              <li>Valor: R$ {values.totalAmount?.toFixed?.(2) || '0,00'}</li>
            </ul>
          </div>
        )}

        {step === 3 && (
          <div className="summary-box stack">
            <h3>Etapa 4: emitir agora</h3>
            {!emitted ? (
              <>
                <p>Está tudo certo. Clique para emitir agora e registrar o histórico com download do XML.</p>
                <button className="primary-button" type="button" onClick={() => setEmitted(true)}>Emitir agora</button>
              </>
            ) : (
              <>
                <p><strong>Status:</strong> autorizada</p>
                <p><strong>XML:</strong> pronto para download</p>
                <ul>
                  <li>Histórico: nota criada</li>
                  <li>Histórico: XML armazenado</li>
                  <li>Histórico: autorização concluída</li>
                </ul>
                <div className="wizard-actions">
                  <button className="secondary-button" type="button">Baixar XML</button>
                  <button className="primary-button" type="button">Emitir nova nota</button>
                </div>
              </>
            )}
          </div>
        )}

        {Object.keys(errors).length > 0 && <p className="error-text">Revise os campos obrigatórios da etapa atual antes de continuar.</p>}

        <div className="wizard-actions">
          <button className="secondary-button" type="button" disabled={step === 0} onClick={() => setStep((current) => Math.max(current - 1, 0))}>Voltar</button>
          {step < 3 && <button className="primary-button" type="button" onClick={nextStep}>Continuar</button>}
        </div>
      </div>
    </div>
  );
}
