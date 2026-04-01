export function MovementsPage() {
  return (
    <section className="card">
      <h2>Movimentações</h2>
      <p>Estrutura base para registrar entradas e gastos.</p>
      <form className="form">
        <label>Tipo
          <select className="input" defaultValue="entrada">
            <option value="entrada">Registrar entrada</option>
            <option value="gasto">Registrar gasto</option>
          </select>
        </label>
        <label>Valor
          <input className="input" type="number" min="0.01" step="0.01" placeholder="0,00" />
        </label>
        <label>Descrição
          <input className="input" placeholder="Ex: venda de serviço" />
        </label>
        <label>Data
          <input className="input" type="date" />
        </label>
        <button className="btn" type="button">Salvar movimentação</button>
      </form>
    </section>
  );
}
