import Dashboard from '@/components/dashboard/Dashboard';
import React from 'react';

const mockData = {
  totalIncome: 8500,
  totalExpense: 5200,
  balance: 3300,
  expensesByCategory: [
    { category: 'Moradia', total: 1800 },
    { category: 'Alimentação', total: 1200 },
    { category: 'Transporte', total: 700 },
    { category: 'Lazer', total: 900 },
    { category: 'Saúde', total: 600 },
  ],
  top5Expenses: [
    { _id: '1', description: 'Aluguel', category: 'Moradia', amount: 1500, date: '2026-03-01' },
    { _id: '2', description: 'Supermercado', category: 'Alimentação', amount: 850, date: '2026-03-07' },
    { _id: '3', description: 'Parcela carro', category: 'Transporte', amount: 700, date: '2026-03-10' },
    { _id: '4', description: 'Plano de saúde', category: 'Saúde', amount: 600, date: '2026-03-05' },
    { _id: '5', description: 'Restaurantes', category: 'Lazer', amount: 500, date: '2026-03-08' },
  ],
};

export default function DashboardPage() {
  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1>Dashboard Financeiro</h1>
      <Dashboard data={mockData} />
    </main>
  );
}
