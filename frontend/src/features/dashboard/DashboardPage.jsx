export function DashboardPage({ user }) {
  return (
    <section className="card">
      <h2>Dashboard</h2>
      <p>Olá, {user?.name}. Esta é a fundação do painel financeiro.</p>
      <div className="grid">
        <article className="metric"><span>Entradas do mês</span><strong>R$ 0,00</strong></article>
        <article className="metric"><span>Gastos do mês</span><strong>R$ 0,00</strong></article>
        <article className="metric"><span>Lucro do mês</span><strong>R$ 0,00</strong></article>
        <article className="metric"><span>Saldo atual</span><strong>R$ 0,00</strong></article>
      </div>
    </section>
  );
}
