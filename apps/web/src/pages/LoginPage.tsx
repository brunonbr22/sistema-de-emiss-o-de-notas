export function LoginPage() {
  return (
    <div className="centered-page">
      <div className="card small-card">
        <p className="eyebrow">Acesso</p>
        <h1>Entrar na sua conta</h1>
        <p className="muted">Tela preparada para autenticação JWT e múltiplas empresas.</p>
        <form className="stack">
          <input placeholder="Seu e-mail" />
          <input placeholder="Sua senha" type="password" />
          <button className="primary-button" type="button">Entrar</button>
        </form>
      </div>
    </div>
  );
}
