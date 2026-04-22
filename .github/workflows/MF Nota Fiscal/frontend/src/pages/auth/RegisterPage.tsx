import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { FormField } from '../../components/FormField';
import { AuthCard } from './AuthCard';

const schema = z.object({
  name: z.string().min(2, 'Informe seu nome completo.'),
  email: z.string().email('E-mail inválido.'),
  password: z
    .string()
    .min(8, 'A senha deve ter ao menos 8 caracteres.')
    .max(64),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, {
  message: 'As senhas não coincidem.',
  path: ['confirm'],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
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
      await registerUser(data.name, data.email, data.password);
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setServerError(msg ?? 'Erro ao criar conta. Tente novamente.');
    }
  };

  return (
    <AuthCard title="Criar conta grátis" subtitle="14 dias grátis, sem cartão de crédito.">
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <FormField
          label="Nome completo"
          type="text"
          autoComplete="name"
          placeholder="João Silva"
          error={errors.name?.message}
          {...register('name')}
        />
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
          autoComplete="new-password"
          placeholder="Mín. 8 caracteres"
          error={errors.password?.message}
          {...register('password')}
        />
        <FormField
          label="Confirmar senha"
          type="password"
          autoComplete="new-password"
          placeholder="Repita a senha"
          error={errors.confirm?.message}
          {...register('confirm')}
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
            marginTop: 4,
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
          {isSubmitting ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>

      <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--color-muted)', marginTop: 20 }}>
        Já tem conta?{' '}
        <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
          Entrar
        </Link>
      </p>
    </AuthCard>
  );
}
