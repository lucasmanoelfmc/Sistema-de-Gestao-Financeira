import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
        background: 'linear-gradient(180deg, #f0fdf4 0%, #f8fafc 100%)',
      }}
    >
      <RegisterForm />
    </main>
  );
}