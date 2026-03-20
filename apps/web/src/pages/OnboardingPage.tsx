export function OnboardingPage() {
  return (
    <div className="stack large-gap">
      <section className="header-row">
        <div>
          <p className="eyebrow">Onboarding automático</p>
          <h2>Cadastre sua empresa pelo CNPJ</h2>
          <p className="muted">Nós puxamos os dados essenciais e traduzimos o fiscal para uma linguagem simples.</p>
        </div>
      </section>
      <section className="grid two-columns">
        <div className="card stack">
          <label>CNPJ</label>
          <input placeholder="00.000.000/0001-00" />
          <button className="primary-button" type="button">Buscar empresa</button>
        </div>
        <div className="card stack">
          <h3>Prévia do resultado</h3>
          <ul>
            <li>Regime sugerido: MEI</li>
            <li>Cidade da empresa: São Paulo/SP</li>
            <li>Notas disponíveis: NF-e e NFS-e padrão nacional</li>
            <li>Trial ativado: 14 dias</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
