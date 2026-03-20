import { NavLink, Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Beta nacional</p>
          <h1>Nota simples</h1>
          <p className="muted">Seu emissor de NF-e e NFS-e para MEI, sem contábil complicado.</p>
        </div>
        <nav>
          <NavLink to="/app">Painel</NavLink>
          <NavLink to="/app/onboarding">Onboarding por CNPJ</NavLink>
          <NavLink to="/app/emitir">Wizard de emissão</NavLink>
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
