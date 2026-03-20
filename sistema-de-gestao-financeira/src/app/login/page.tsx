import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
        background: 'linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%)',
      }}
    >
      <LoginForm />
    </main>
  );
}