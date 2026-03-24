'use client';

import ExportDataButton from '@/components/export/ExportDataButton';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type ExpenseCategoryItem = {
  category: string;
  total: number;
};

type TopExpenseItem = {
  _id?: string;
  description: string;
  category: string;
  amount: number;
  date: string;
};

export type DashboardData = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  expensesByCategory: ExpenseCategoryItem[];
  top5Expenses: TopExpenseItem[];
};

type DashboardProps = {
  data: DashboardData;
  monthLabel: string;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  loading?: boolean;
};

const COLORS = ['#2563eb', '#dc2626', '#16a34a', '#eab308', '#7c3aed', '#0891b2'];

function currency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function Dashboard({
  data,
  monthLabel,
  onPreviousMonth,
  onNextMonth,
  loading = false,
}: DashboardProps) {
  const barData = [
    { name: 'Resumo Mensal', renda: data.totalIncome, despesas: data.totalExpense },
  ];
  const exportRows = [
    {
      secao: 'Resumo',
      renda_total: data.totalIncome,
      despesa_total: data.totalExpense,
      saldo: data.balance,
    },
    ...data.expensesByCategory.map((item) => ({
      secao: 'Despesas por categoria',
      categoria: item.category,
      total: item.total,
    })),
    ...data.top5Expenses.map((item) => ({
      secao: 'Top 5 despesas',
      descricao: item.description,
      categoria: item.category,
      valor: item.amount,
      data: new Date(item.date).toLocaleDateString('pt-BR'),
    })),
  ];

  return (
    <section style={{ display: 'grid', gap: 20 }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Dashboard Financeiro</h1>
          <p style={{ margin: '8px 0 0', color: '#6b7280' }}>{monthLabel}</p>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <ExportDataButton fileBaseName="dashboard-financeiro" title={`Exportação ${monthLabel}`} rows={exportRows} />
          <button type="button" onClick={onPreviousMonth} style={navButtonStyle}>
            ← Mês anterior
          </button>
          <button type="button" onClick={onNextMonth} style={navButtonStyle}>
            Próximo mês →
          </button>
        </div>
      </header>

      {loading ? <p>Carregando dashboard...</p> : null}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))', gap: 12 }}>
        <Card title="Total de Renda" value={currency(data.totalIncome)} color="#16a34a" />
        <Card title="Total de Despesas" value={currency(data.totalExpense)} color="#dc2626" />
        <Card title="Saldo" value={currency(data.balance)} color={data.balance >= 0 ? '#2563eb' : '#dc2626'} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <article style={panelStyle}>
          <h2>Despesas por Categoria</h2>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data.expensesByCategory} dataKey="total" nameKey="category" outerRadius={90} label>
                  {data.expensesByCategory.map((item, index) => (
                    <Cell key={item.category} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => currency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article style={panelStyle}>
          <h2>Renda vs Despesas</h2>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => currency(value)} />
                <Legend />
                <Bar dataKey="renda" fill="#16a34a" />
                <Bar dataKey="despesas" fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>

      <article style={panelStyle}>
        <h2>Top 5 Despesas</h2>
        <ol style={{ display: 'grid', gap: 10, paddingLeft: 20, margin: 0 }}>
          {data.top5Expenses.map((expense) => (
            <li key={expense._id ?? `${expense.description}-${expense.date}`}>
              <strong>{expense.description}</strong> — {expense.category} — {currency(expense.amount)}
            </li>
          ))}
        </ol>
      </article>
    </section>
  );
}

const panelStyle = {
  padding: 16,
  border: '1px solid #e5e7eb',
  borderRadius: 12,
  backgroundColor: '#fff',
} as const;

const navButtonStyle = {
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid #d1d5db',
  backgroundColor: '#fff',
  cursor: 'pointer',
} as const;

function Card({ title, value, color }: { title: string; value: string; color: string }) {
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
