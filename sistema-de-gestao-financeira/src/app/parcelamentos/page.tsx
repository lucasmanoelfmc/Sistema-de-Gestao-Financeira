import InstallmentsManager from '@/components/installments/InstallmentsManager';
import AppTopbar from '@/components/layout/AppTopbar';

export default function ParcelamentosPage() {
  return (
    <main style={{ padding: 24, maxWidth: 1200, margin: '0 auto', display: 'grid', gap: 16 }}>
      <AppTopbar />
      <InstallmentsManager />
    </main>
  );
}