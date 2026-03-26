const onboardingPreview = [
  'Razão social identificada automaticamente',
  'Município, UF e CNAE principal preenchidos',
  'Classificação da atividade: comércio, serviço ou ambos',
  'Empresa criada no sistema com usuário OWNER e trial de 14 dias',
];

export function OnboardingPage() {
  return (
    <div className="stack large-gap">
      <section className="header-row">
        <div>
          <p className="eyebrow">Onboarding automático</p>
          <h2>Digite apenas o CNPJ</h2>
          <p className="muted">O sistema consulta os dados da empresa, cria o cadastro e já ativa seu período de teste.</p>
        </div>
      </section>
      <section className="grid two-columns">
        <div className="card stack">
          <label>CNPJ</label>
          <input placeholder="00.000.000/0001-00" />
          <button className="primary-button" type="button">Criar empresa automaticamente</button>
        </div>
        <div className="card stack">
          <h3>O que acontece depois</h3>
          <ul>
            {onboardingPreview.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </section>
    </div>
  );
}
