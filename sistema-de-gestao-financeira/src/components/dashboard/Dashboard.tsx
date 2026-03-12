'use client';

import React from 'react';
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

type DashboardData = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  expensesByCategory: ExpenseCategoryItem[];
  top5Expenses: TopExpenseItem[];
};

type DashboardProps = {
  data: DashboardData;
};

const COLORS = ['#2563eb', '#dc2626', '#16a34a', '#eab308', '#7c3aed', '#0891b2'];

function currency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function Dashboard({ data }: DashboardProps) {
  const barData = [
    { name: 'Resumo Mensal', renda: data.totalIncome, despesas: data.totalExpense },
  ];

  return (
    <section style={{ display: 'grid', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))', gap: 12 }}>
        <Card title="Total de Renda" value={currency(data.totalIncome)} color="#16a34a" />
        <Card title="Total de Despesas" value={currency(data.totalExpense)} color="#dc2626" />
        <Card title="Saldo" value={currency(data.balance)} color={data.balance >= 0 ? '#2563eb' : '#dc2626'} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <article style={{ padding: 16, border: '1px solid #e5e7eb', borderRadius: 12 }}>
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

        <article style={{ padding: 16, border: '1px solid #e5e7eb', borderRadius: 12 }}>
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

      <article style={{ padding: 16, border: '1px solid #e5e7eb', borderRadius: 12 }}>
        <h2>Top 5 Despesas</h2>
        <ol style={{ display: 'grid', gap: 10, paddingLeft: 20 }}>
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
