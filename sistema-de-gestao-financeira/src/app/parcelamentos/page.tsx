import AppTopbar from '@/components/layout/AppTopbar';

export default function ParcelamentosPage() {
  return (
    <main style={{ padding: 24, maxWidth: 1200, margin: '0 auto', display: 'grid', gap: 16 }}>
      <AppTopbar />
      <section style={{ padding: 16, borderRadius: 12, border: '1px solid #e5e7eb', backgroundColor: '#fff' }}>
        <h1>Parcelamentos</h1>
        <p>Em breve você poderá visualizar e gerenciar parcelamentos nesta página.</p>
      </section>
    </main>
  );
}