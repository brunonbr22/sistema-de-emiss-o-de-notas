export function LoginPage() {
  return (
    <div className="centered-page">
      <div className="grid two-columns auth-grid">
        <div className="card small-card stack">
          <p className="eyebrow">Cadastro</p>
          <h1>Crie sua conta</h1>
          <p className="muted">Comece com nome, e-mail e senha para liberar o onboarding por CNPJ.</p>
          <form className="stack">
            <input placeholder="Seu nome" />
            <input placeholder="Seu e-mail" />
            <input placeholder="Crie uma senha" type="password" />
            <button className="primary-button" type="button">Criar conta</button>
          </form>
        </div>
        <div className="card small-card stack">
          <p className="eyebrow">Acesso</p>
          <h1>Entrar na sua conta</h1>
          <p className="muted">A autenticação está preparada para JWT e múltiplas empresas por usuário.</p>
          <form className="stack">
            <input placeholder="Seu e-mail" />
            <input placeholder="Sua senha" type="password" />
            <button className="primary-button" type="button">Entrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
