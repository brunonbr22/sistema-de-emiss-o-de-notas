import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { FormField } from '../../components/FormField';
import { AuthCard } from './AuthCard';

const schema = z.object({
  email: z.string().email('E-mail inválido.'),
  password: z.string().min(1, 'Informe a senha.'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError('');
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch {
      setServerError('E-mail ou senha incorretos.');
    }
  };

  return (
    <AuthCard title="Entrar na sua conta">
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <FormField
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="joao@exemplo.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <FormField
          label="Senha"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        {serverError && (
          <p style={{ fontSize: 14, color: 'var(--color-error)', textAlign: 'center' }}>
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '11px 0',
            background: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius)',
            fontSize: 15,
            fontWeight: 600,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.7 : 1,
          }}
        >
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--color-muted)', marginTop: 20 }}>
        Não tem conta?{' '}
        <Link to="/cadastro" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
          Criar conta grátis
        </Link>
      </p>
    </AuthCard>
  );
}
