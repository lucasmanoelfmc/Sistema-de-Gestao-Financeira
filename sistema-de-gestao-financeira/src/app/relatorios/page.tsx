import AnnualReport from '@/components/reports/AnnualReport';
import AppTopbar from '@/components/layout/AppTopbar';

export default function RelatoriosPage() {
  return (
    <main style={{ padding: 24, maxWidth: 1200, margin: '0 auto', display: 'grid', gap: 16 }}>
      <AppTopbar />
      <AnnualReport />
    </main>
  );
}