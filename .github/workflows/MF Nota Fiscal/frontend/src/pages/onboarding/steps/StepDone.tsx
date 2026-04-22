interface Props {
  onGo: () => void;
}

export function StepDone({ onGo }: Props) {
  return (
    <div style={{ textAlign: 'center', padding: '8px 0' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Empresa cadastrada!</h2>
      <p style={{ color: 'var(--color-muted)', fontSize: 14, marginBottom: 8 }}>
        Seu trial de 14 dias já começou.
      </p>
      <p style={{ color: 'var(--color-muted)', fontSize: 14, marginBottom: 32 }}>
        Agora você pode emitir suas notas fiscais em menos de 1 minuto.
      </p>
      <button
        onClick={onGo}
        style={{
          padding: '12px 32px',
          background: 'var(--color-primary)',
          color: '#fff',
          border: 'none',
          borderRadius: 'var(--radius)',
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Ir para o painel
      </button>
    </div>
  );
}
