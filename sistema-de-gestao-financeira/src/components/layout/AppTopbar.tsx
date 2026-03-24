'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/rendas', label: 'Rendas' },
  { href: '/despesas', label: 'Despesas' },
  { href: '/reservas', label: 'Reservas' },
  { href: '/parcelamentos', label: 'Parcelamentos' },
  { href: '/contas', label: 'Contas' },
  { href: '/relatorios', label: 'Relatórios' },
];

export default function AppTopbar() {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    router.push('/login');
  }

  return (
    <nav
      style={{
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        border: '1px solid #e5e7eb',
        backgroundColor: '#fff',
      }}
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          style={{
            padding: '8px 12px',
            borderRadius: 10,
            border: '1px solid #d1d5db',
            textDecoration: 'none',
            color: '#0f172a',
            fontWeight: 600,
          }}
        >
          {link.label}
        </Link>
      ))}

      <button
        type="button"
        onClick={handleLogout}
        style={{
          marginLeft: 'auto',
          padding: '8px 12px',
          borderRadius: 10,
          border: '1px solid #b91c1c',
          backgroundColor: '#dc2626',
          color: '#fff',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        Sair
      </button>
    </nav>
  );
}