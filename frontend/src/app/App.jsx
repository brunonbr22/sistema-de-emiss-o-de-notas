import { useMemo, useState } from 'react';
import { AuthPage } from '../features/auth/AuthPage.jsx';
import { DashboardPage } from '../features/dashboard/DashboardPage.jsx';
import { MovementsPage } from '../features/movements/MovementsPage.jsx';

export function App() {
  const [session, setSession] = useState(null);
  const [screen, setScreen] = useState('dashboard');

  const content = useMemo(() => {
    if (!session) {
      return <AuthPage onLoginSuccess={setSession} />;
    }

    if (screen === 'dashboard') {
      return <DashboardPage user={session.user} />;
    }

    return <MovementsPage />;
  }, [session, screen]);

  return (
    <main className="container">
      <header className="card topbar">
        <h1>Financeiro MEI Simples</h1>
        {session && (
          <nav className="menu">
            <button className="btn secondary" onClick={() => setScreen('dashboard')}>Dashboard</button>
            <button className="btn secondary" onClick={() => setScreen('movements')}>Movimentações</button>
            <button className="btn" onClick={() => setSession(null)}>Sair</button>
          </nav>
        )}
      </header>
      {content}
    </main>
  );
}
