import ExpensesManager from '@/components/finance/ExpensesManager';
import AppTopbar from '@/components/layout/AppTopbar';

export default function DespesasPage() {
  return (
    <main style={{ padding: 24, maxWidth: 1200, margin: '0 auto', display: 'grid', gap: 16 }}>
      <AppTopbar />
      <ExpensesManager />
    </main>
  );
}