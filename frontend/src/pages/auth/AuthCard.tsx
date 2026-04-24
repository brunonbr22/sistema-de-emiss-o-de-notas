import { ReactNode } from 'react';

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg)',
        padding: '24px 16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'var(--color-surface)',
          borderRadius: 12,
          boxShadow: '0 4px 24px 0 rgb(0 0 0 / 0.08)',
          padding: '40px 36px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-primary)' }}>
            MF Mei
          </span>
          <h1 style={{ fontSize: 20, fontWeight: 600, marginTop: 16, color: 'var(--color-text)' }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: 14, color: 'var(--color-muted)', marginTop: 6 }}>{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
