import Link from 'next/link';

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
    </nav>
  );
}