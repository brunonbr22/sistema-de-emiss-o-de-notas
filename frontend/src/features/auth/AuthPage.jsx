import { useState } from 'react';
import { api } from '../../services/api.js';

export function AuthPage({ onLoginSuccess }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  async function submit(e) {
    e.preventDefault();
    setMessage('');

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : form;

      const result = await api.post(endpoint, payload);
      onLoginSuccess(result);
    } catch (error) {
      setMessage(error.message || 'Não foi possível continuar.');
    }
  }

  return (
    <section className="card">
      <h2>{mode === 'login' ? 'Entrar' : 'Criar conta'}</h2>
      <p>Base inicial pronta para autenticação MEI.</p>
      <form className="form" onSubmit={submit}>
        {mode === 'register' && (
          <label>Nome
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </label>
        )}
        <label>Email
          <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </label>
        <label>Senha
          <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </label>
        <button className="btn" type="submit">{mode === 'login' ? 'Entrar' : 'Cadastrar'}</button>
        <button className="btn secondary" type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'Não tenho conta' : 'Já tenho conta'}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </section>
  );
}
