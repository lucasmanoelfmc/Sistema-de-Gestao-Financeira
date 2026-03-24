import IncomesManager from '@/components/finance/IncomesManager';
import AppTopbar from '@/components/layout/AppTopbar';

export default function RendasPage() {
  return (
    <main style={{ padding: 24, maxWidth: 1200, margin: '0 auto', display: 'grid', gap: 16 }}>
      <AppTopbar />
      <IncomesManager />
    </main>
  );
}