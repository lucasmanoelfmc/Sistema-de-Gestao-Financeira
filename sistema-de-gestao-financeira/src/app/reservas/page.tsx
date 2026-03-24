import MyReserves from '@/components/reserves/MyReserves';
import AppTopbar from '@/components/layout/AppTopbar';

export default function ReservasPage() {
  return (
    <main style={{ padding: 24, maxWidth: 1200, margin: '0 auto', display: 'grid', gap: 16 }}>
      <AppTopbar />
      <MyReserves />
    </main>
  );
}