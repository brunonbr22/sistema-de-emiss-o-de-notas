const cards = [
  { title: 'Período de teste', value: '14 dias grátis', detail: 'Ativado ao cadastrar cada empresa.' },
  { title: 'Empresas', value: '2 empresas', detail: 'Estrutura multiempresa pronta para o MVP.' },
  { title: 'Últimas notas', value: '12 emitidas', detail: 'NF-e e NFS-e no mesmo fluxo.' },
];

export function DashboardPage() {
  return (
    <div className="stack large-gap">
      <section className="header-row">
        <div>
          <p className="eyebrow">Painel simples</p>
          <h2>Bom dia, Maria 👋</h2>
          <p className="muted">Aqui você acompanha empresas, período de trial e suas últimas emissões.</p>
        </div>
        <button className="primary-button">Emitir nova nota</button>
      </section>

      <section className="grid three-columns">
        {cards.map((card) => (
          <article className="card" key={card.title}>
            <p className="muted">{card.title}</p>
            <h3>{card.value}</h3>
            <p>{card.detail}</p>
          </article>
        ))}
      </section>

      <section className="card">
        <h3>Automação fiscal inteligente para MEI</h3>
        <p>
          O motor fiscal reduz campos, sugere a natureza correta, destaca alertas de município para NFS-e e guarda XML autorizado automaticamente.
        </p>
      </section>
    </div>
  );
}
