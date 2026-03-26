const cards = [
  { title: 'Boas-vindas', value: 'Olá, Maria!', detail: 'Sua conta está pronta para começar a emitir.' },
  { title: 'Trial restante', value: '11 dias', detail: 'Seu teste grátis foi ativado no onboarding por CNPJ.' },
  { title: 'Última emissão', value: 'Status: autorizada', detail: 'XML pronto para download e histórico salvo.' },
];

const history = [
  { id: 'NF-1024', customer: 'Padaria Sol', amount: 'R$ 180,00', status: 'Autorizada', xml: 'Baixar XML' },
  { id: 'NFS-2011', customer: 'Studio Rocha', amount: 'R$ 350,00', status: 'Processando', xml: 'XML em preparo' },
];

export function DashboardPage() {
  return (
    <div className="stack large-gap">
      <section className="header-row">
        <div>
          <p className="eyebrow">Painel simples</p>
          <h2>Bem-vinda de volta 👋</h2>
          <p className="muted">Acompanhe seu trial, clique em emitir nota e veja o histórico com status e XML.</p>
        </div>
        <button className="primary-button">Emitir nota</button>
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

      <section className="card stack">
        <div>
          <p className="eyebrow">Pós-emissão</p>
          <h3>Suas notas recentes</h3>
        </div>
        {history.map((item) => (
          <div className="history-row" key={item.id}>
            <div>
              <strong>{item.id}</strong>
              <p className="muted">{item.customer}</p>
            </div>
            <div>
              <strong>{item.amount}</strong>
              <p className="muted">{item.status}</p>
            </div>
            <button className="secondary-button">{item.xml}</button>
          </div>
        ))}
      </section>
    </div>
  );
}
