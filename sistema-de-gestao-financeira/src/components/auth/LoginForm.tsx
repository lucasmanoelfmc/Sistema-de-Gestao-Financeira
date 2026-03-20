'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

type LoginResponse = {
  token: string;
  user?: {
    id?: string;
    email?: string;
    name?: string;
  };
  message?: string;
};

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as LoginResponse;

      if (!response.ok || !data.token) {
        throw new Error(data.message || 'Falha no login.');
      }

      localStorage.setItem('token', data.token);

      if (data.user?.id) {
        localStorage.setItem('userId', data.user.id);
      }

      router.replace('/dashboard');
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Erro ao fazer login.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      style={{
        width: '100%',
        maxWidth: 420,
        padding: 24,
        borderRadius: 16,
        border: '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
      }}
    >
      <header style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0 }}>Login</h1>
        <p style={{ margin: '8px 0 0', color: '#6b7280' }}>
          Entre com seu email e senha para acessar o dashboard financeiro.
        </p>
      </header>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
        <div style={{ display: 'grid', gap: 6 }}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="seuemail@exemplo.com"
            required
            style={{ padding: 12, borderRadius: 10, border: '1px solid #d1d5db' }}
          />
        </div>

        <div style={{ display: 'grid', gap: 6 }}>
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Digite sua senha"
            required
            style={{ padding: 12, borderRadius: 10, border: '1px solid #d1d5db' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 12,
            borderRadius: 10,
            border: 'none',
            backgroundColor: '#2563eb',
            color: '#fff',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Entrando...' : 'Login'}
        </button>

        {error ? (
          <p style={{ margin: 0, color: '#c00', fontSize: 14 }}>{error}</p>
        ) : null}
      </form>
    </section>
  );
}