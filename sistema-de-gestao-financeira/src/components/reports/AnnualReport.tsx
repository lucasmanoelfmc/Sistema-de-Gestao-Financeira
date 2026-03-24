'use client';

import { useEffect, useMemo, useState } from 'react';
import ExportDataButton from '@/components/export/ExportDataButton';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type MonthlyReportItem = {
  month: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
};

type AnnualReportData = {
  year: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  monthlyReport: MonthlyReportItem[];
};

function currency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const MONTH_LABELS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export default function AnnualReport() {
  const [userId, setUserId] = useState('');
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [data, setData] = useState<AnnualReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadReport(selectedYear: string, selectedUserId: string) {
    if (!selectedYear || !selectedUserId) {
      setData(null);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/reports/annual?year=${selectedYear}&userId=${selectedUserId}`);
      const reportData = await response.json();

      if (!response.ok) {
        throw new Error(reportData.message || 'Erro ao carregar relatório anual.');
      }

      setData(reportData);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : 'Erro ao carregar relatório anual.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const savedUserId = localStorage.getItem('userId') || '';
    setUserId(savedUserId);
    void loadReport(year, savedUserId);
  }, [year]);

  const chartData = useMemo(
    () =>
      (data?.monthlyReport || []).map((item) => ({
        month: MONTH_LABELS[item.month - 1],
        renda: item.totalIncome,
        despesas: item.totalExpense,
        saldo: item.balance,
      })),
    [data]
  );
  const exportRows = useMemo(() => {
    if (!data) {
      return [];
    }

    return [
      {
        tipo: 'Resumo anual',
        ano: data.year,
        renda_total: data.totalIncome,
        despesa_total: data.totalExpense,
        saldo_total: data.balance,
      },
      ...data.monthlyReport.map((item) => ({
        tipo: 'Mês',
        mes: MONTH_LABELS[item.month - 1],
        renda: item.totalIncome,
        despesas: item.totalExpense,
        saldo: item.balance,
      })),
    ];
  }, [data]);

  return (
    <section style={{ display: 'grid', gap: 20 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <h1 style={{ margin: 0 }}>Relatório Anual</h1>
        <ExportDataButton fileBaseName="relatorio-anual" title="Exportação do Relatório Anual" rows={exportRows} />
      </header>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(2, minmax(220px, 1fr))' }}>
        
        <div>
          <label htmlFor="annual-year">Ano</label>
          <input
            id="annual-year"
            type="number"
            value={year}
            onChange={(event) => setYear(event.target.value)}
            placeholder="Ano"
          />
        </div>
      </div>

      {error ? <p style={{ color: '#c00' }}>{error}</p> : null}
      {loading ? <p>Carregando...</p> : null}

      {data ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))', gap: 12 }}>
            <SummaryCard title="Total de renda no ano" value={currency(data.totalIncome)} color="#16a34a" />
            <SummaryCard title="Total de despesas" value={currency(data.totalExpense)} color="#dc2626" />
            <SummaryCard title="Saldo final" value={currency(data.balance)} color={data.balance >= 0 ? '#2563eb' : '#dc2626'} />
          </div>

          <article style={{ padding: 16, border: '1px solid #e5e7eb', borderRadius: 12 }}>
            <h2>Evolução Mensal</h2>
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => currency(value)} />
                  <Legend />
                  <Bar dataKey="renda" fill="#16a34a" />
                  <Bar dataKey="despesas" fill="#dc2626" />
                  <Bar dataKey="saldo" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>
        </>
      ) : null}
    </section>
  );
}

function SummaryCard({ title, value, color }: { title: string; value: string; color: string }) {
  return (
    <article
      style={{
        padding: 16,
        borderRadius: 12,
        border: '1px solid #e5e7eb',
        borderLeft: `6px solid ${color}`,
        backgroundColor: '#fff',
      }}
    >
      <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>{title}</p>
      <strong style={{ fontSize: 20 }}>{value}</strong>
    </article>
  );
}
