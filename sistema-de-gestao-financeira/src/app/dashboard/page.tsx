'use client';

import { useEffect, useMemo, useState } from 'react';
import Dashboard, { DashboardData } from '@/components/dashboard/Dashboard';
import AppTopbar from '@/components/layout/AppTopbar';


const EMPTY_DASHBOARD: DashboardData = {
  totalIncome: 0,
  totalExpense: 0,
  balance: 0,
  expensesByCategory: [],
  top5Expenses: [],
};

const MONTH_LABELS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [userId, setUserId] = useState('');
  const [data, setData] = useState<DashboardData>(EMPTY_DASHBOARD);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const month = selectedDate.getMonth() + 1;
  const year = selectedDate.getFullYear();

  const monthLabel = useMemo(
    () => `${MONTH_LABELS[selectedDate.getMonth()]} de ${selectedDate.getFullYear()}`,
    [selectedDate]
  );

  async function loadDashboard(currentUserId: string, currentMonth: number, currentYear: number) {
    if (!currentUserId) {
      setData(EMPTY_DASHBOARD);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `/api/reports/monthly?userId=${currentUserId}&month=${currentMonth}&year=${currentYear}`
      );
      const dashboardData = await response.json();

      if (!response.ok) {
        throw new Error(dashboardData.message || 'Erro ao carregar dashboard.');
      }

      setData(dashboardData);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : 'Erro ao carregar dashboard.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const savedUserId = localStorage.getItem('userId') || '';
    setUserId(savedUserId);
    void loadDashboard(savedUserId, month, year);
  }, [month, year]);

  function handlePreviousMonth() {
    setSelectedDate((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  function handleNextMonth() {
    setSelectedDate((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  return (
    <main
      style={{
        padding: 24,
        maxWidth: 1200,
        margin: '0 auto',
        display: 'grid',
        gap: 16,
        backgroundColor: '#f8fafc',
      }}
    >

      <AppTopbar  />

      <div style={{ display: 'grid', gap: 8 }}>
        <label htmlFor="dashboard-user-id">User ID</label>
        <input
          id="dashboard-user-id"
          value={userId}
          onChange={(event) => setUserId(event.target.value)}
          placeholder="Informe o userId"
          style={{ padding: 12, borderRadius: 10, border: '1px solid #d1d5db', maxWidth: 360 }}
        />
        <button
          type="button"
          onClick={() => void loadDashboard(userId, month, year)}
          style={{ width: 'fit-content', padding: '10px 14px', borderRadius: 10, border: 'none', backgroundColor: '#2563eb', color: '#fff' }}
        >
          Atualizar dashboard
        </button>
      </div>

      {error ? <p style={{ color: '#c00' }}>{error}</p> : null}

      <Dashboard
        data={data}
        monthLabel={monthLabel}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
        loading={loading}
      />
    </main>
  );
}