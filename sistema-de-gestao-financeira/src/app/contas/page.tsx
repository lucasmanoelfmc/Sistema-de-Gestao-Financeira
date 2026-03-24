import CardsManager from '@/components/cards/CardsManager';
import AppTopbar from '@/components/layout/AppTopbar';

export default function ContasPage() {
  return (
    <main style={{ padding: 24, maxWidth: 1200, margin: '0 auto', display: 'grid', gap: 16 }}>
      <AppTopbar />
      <CardsManager />
    </main>
  );
}