'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

type RegisterResponse = {
  token?: string;
  user?: {
    id?: string;
    email?: string;
    name?: string;
  };
  message?: string;
};

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = (await response.json()) as RegisterResponse;

      if (!response.ok) {
        throw new Error(data.message || 'Falha ao registrar usuário.');
      }

      setSuccess('Conta criada com sucesso. Redirecionando para login...');
      setTimeout(() => {
        router.replace('/login');
      }, 900);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Erro ao registrar usuário.';
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
        <h1 style={{ margin: 0 }}>Criar conta</h1>
        <p style={{ margin: '8px 0 0', color: '#6b7280' }}>
          Preencha os dados para criar seu acesso ao sistema.
        </p>
      </header>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
        <div style={{ display: 'grid', gap: 6 }}>
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Seu nome"
            required
            style={{ padding: 12, borderRadius: 10, border: '1px solid #d1d5db' }}
          />
        </div>

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
            placeholder="Crie uma senha"
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
            backgroundColor: '#16a34a',
            color: '#fff',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Registrando...' : 'Registrar'}
        </button>

        <Link
          href="/login"
          style={{
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 12,
            borderRadius: 10,
            border: '1px solid #2563eb',
            color: '#2563eb',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Voltar para login
        </Link>

        {success ? <p style={{ margin: 0, color: '#15803d', fontSize: 14 }}>{success}</p> : null}
        {error ? <p style={{ margin: 0, color: '#c00', fontSize: 14 }}>{error}</p> : null}
      </form>
    </section>
  );
}