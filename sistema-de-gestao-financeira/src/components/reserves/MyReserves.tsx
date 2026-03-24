'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import ExportDataButton from '@/components/export/ExportDataButton';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type ReserveItem = {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
  source?: string;
};

type ReserveFormState = {
  amount: string;
  date: string;
  description: string;
  category: string;
  source: string;
};

const DEFAULT_FORM: ReserveFormState = {
  amount: '',
  date: new Date().toISOString().slice(0, 10),
  description: '',
  category: 'Reserva',
  source: '',
};

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function MyReserves() {
  const [userId, setUserId] = useState('');
  const [items, setItems] = useState<ReserveItem[]>([]);
  const [form, setForm] = useState<ReserveFormState>(DEFAULT_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadReserves(selectedUserId: string) {
    if (!selectedUserId) {
      setItems([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/reserves?userId=${selectedUserId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao carregar reservas.');
      }

      setItems(data);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : 'Erro ao carregar reservas.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const savedUserId = localStorage.getItem('userId') || '';
    setUserId(savedUserId);
    void loadReserves(savedUserId);
  }, []);

  const chartData = useMemo(() => {
    let accumulated = 0;

    return items.map((item) => {
      accumulated += item.amount;

      return {
        date: new Date(item.date).toLocaleDateString('pt-BR'),
        total: accumulated,
      };
    });
  }, [items]);
  const exportRows = useMemo(
    () =>
      items.map((item) => ({
        data: new Date(item.date).toLocaleDateString('pt-BR'),
        descricao: item.description,
        categoria: item.category,
        origem: item.source || '-',
        valor: item.amount,
      })),
    [items]
  );

  function updateField<K extends keyof ReserveFormState>(field: K, value: ReserveFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...form,
        amount: Number(form.amount),
        user: userId,
      };

      const response = await fetch(editingId ? `/api/reserves/${editingId}` : '/api/reserves', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { ...payload, userId } : payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao salvar aporte.');
      }

      setForm(DEFAULT_FORM);
      setEditingId(null);
      await loadReserves(userId);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Erro ao salvar aporte.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(item: ReserveItem) {
    setEditingId(item._id);
    setForm({
      amount: String(item.amount),
      date: item.date.slice(0, 10),
      description: item.description,
      category: item.category,
      source: item.source || '',
    });
  }

  async function handleDelete(id: string) {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/reserves/${id}?userId=${userId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao remover aporte.');
      }

      await loadReserves(userId);
    } catch (deleteError) {
      const message = deleteError instanceof Error ? deleteError.message : 'Erro ao remover aporte.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section style={{ display: 'grid', gap: 20 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <h1 style={{ margin: 0 }}>Minhas Reservas</h1>
        <ExportDataButton fileBaseName="reservas" title="Exportação de Reservas" rows={exportRows} />
      </header>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <input
          type="number"
          step="0.01"
          value={form.amount}
          onChange={(event) => updateField('amount', event.target.value)}
          placeholder="Valor do aporte"
          required
        />
        <input
          type="date"
          value={form.date}
          onChange={(event) => updateField('date', event.target.value)}
          required
        />
        <input
          value={form.description}
          onChange={(event) => updateField('description', event.target.value)}
          placeholder="Descrição"
          required
        />
        <input
          value={form.category}
          onChange={(event) => updateField('category', event.target.value)}
          placeholder="Categoria"
        />
        <input
          value={form.source}
          onChange={(event) => updateField('source', event.target.value)}
          placeholder="Origem do aporte"
        />
        <button type="submit" disabled={loading || !userId}>
          {editingId ? 'Salvar edição' : 'Criar aporte'}
        </button>
      </form>

      {error ? <p style={{ color: '#c00' }}>{error}</p> : null}
      {loading ? <p>Carregando...</p> : null}

      <article style={{ padding: 16, border: '1px solid #e5e7eb', borderRadius: 12 }}>
        <h2>Evolução das Reservas</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={3} name="Reserva acumulada" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Data</th>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Origem</th>
            <th>Valor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{new Date(item.date).toLocaleDateString('pt-BR')}</td>
              <td>{item.description}</td>
              <td>{item.category}</td>
              <td>{item.source || '-'}</td>
              <td>{formatCurrency(item.amount)}</td>
              <td style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={() => handleEdit(item)}>
                  Editar
                </button>
                <button type="button" onClick={() => void handleDelete(item._id)}>
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
