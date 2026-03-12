'use client';

import React from 'react';
import { FormEvent, useState } from 'react';

type LoginResponse = {
  token: string;
};

export default function LoginForm() {
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

      const data = (await response.json()) as LoginResponse & { message?: string };

      if (!response.ok || !data.token) {
        throw new Error(data.message || 'Falha no login.');
      }

      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard';
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Erro ao fazer login.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
      <h1>Entrar</h1>

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <label htmlFor="password">Senha</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Entrando...' : 'Login'}
      </button>

      {error ? <p style={{ color: '#c00' }}>{error}</p> : null}
    </form>
  );
}
