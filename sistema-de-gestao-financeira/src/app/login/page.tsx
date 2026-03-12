import LoginForm from '@/components/auth/LoginForm';
import React from 'react';

export default function LoginPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <LoginForm />
    </main>
  );
}
