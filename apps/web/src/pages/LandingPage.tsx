import { Link } from 'react-router-dom';

const features = [
  'Emissão guiada de NF-e e NFS-e padrão nacional',
  'Onboarding automático por CNPJ',
  'Motor fiscal inteligente pensado para MEI',
  'Trial grátis de 14 dias sem falar com vendedor',
];

export function LandingPage() {
  return (
    <div className="landing">
      <header className="hero-card">
        <span className="badge">Feito para MEI em todo o Brasil</span>
        <h1>O sistema para emitir nota mais simples do Brasil.</h1>
        <p>
          Cadastre seu CNPJ, confirme os dados e emita NF-e ou NFS-e em poucos passos, com linguagem humana e automação fiscal no nível certo para um MVP profissional.
        </p>
        <div className="hero-actions">
          <Link className="primary-button" to="/app">Testar painel</Link>
          <Link className="secondary-button" to="/login">Entrar</Link>
        </div>
      </header>

      <section className="grid two-columns">
        {features.map((feature) => (
          <article className="feature-card" key={feature}>{feature}</article>
        ))}
      </section>

      <section className="grid two-columns">
        <div className="feature-panel">
          <h2>Fluxo simples de verdade</h2>
          <ul>
            <li>1. Digite seu CNPJ.</li>
            <li>2. Revise o que puxamos automaticamente.</li>
            <li>3. Escolha produto ou serviço.</li>
            <li>4. Confira o resumo e emita.</li>
          </ul>
        </div>
        <div className="feature-panel accent">
          <h2>Arquitetura pronta para crescer</h2>
          <p>Backend em NestJS, filas BullMQ, PostgreSQL, Redis, storage de XML em R2 e integrações preparadas para Focus NFe e padrão nacional.</p>
        </div>
      </section>
    </div>
  );
}
