'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

type ExpenseItem = {
  _id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  paymentSource: 'cash' | 'checking' | 'card';
  installments: number;
  installmentNumber: number;
};

type ExpenseFormState = {
  description: string;
  amount: string;
  category: string;
  date: string;
  paymentSource: 'cash' | 'checking' | 'card';
  installments: string;
};

const DEFAULT_FORM: ExpenseFormState = {
  description: '',
  amount: '',
  category: '',
  date: new Date().toISOString().slice(0, 10),
  paymentSource: 'cash',
  installments: '1',
};

export default function ExpensesManager() {
  const [userId, setUserId] = useState('');
  const [items, setItems] = useState<ExpenseItem[]>([]);
  const [form, setForm] = useState<ExpenseFormState>(DEFAULT_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentDate = useMemo(() => new Date(), []);
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  async function loadExpenses(selectedUserId: string) {
    if (!selectedUserId) {
      setItems([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `/api/expenses?userId=${selectedUserId}&month=${month}&year=${year}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao carregar despesas.');
      }

      setItems(data);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : 'Erro ao carregar despesas.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const savedUserId = localStorage.getItem('userId') || '';
    setUserId(savedUserId);
    void loadExpenses(savedUserId);
  }, [month, year]);

  function updateField<K extends keyof ExpenseFormState>(field: K, value: ExpenseFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...form,
        user: userId,
        amount: Number(form.amount),
        installments: Number(form.installments),
      };

      const response = await fetch(editingId ? `/api/expenses/${editingId}` : '/api/expenses', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { ...payload, userId } : payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao salvar despesa.');
      }

      setForm(DEFAULT_FORM);
      setEditingId(null);
      await loadExpenses(userId);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Erro ao salvar despesa.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(item: ExpenseItem) {
    setEditingId(item._id);
    setForm({
      description: item.description,
      amount: String(item.amount),
      category: item.category,
      date: item.date.slice(0, 10),
      paymentSource: item.paymentSource,
      installments: '1',
    });
  }

  async function handleDelete(id: string) {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/expenses/${id}?userId=${userId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao deletar despesa.');
      }

      await loadExpenses(userId);
    } catch (deleteError) {
      const message = deleteError instanceof Error ? deleteError.message : 'Erro ao deletar despesa.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section style={{ display: 'grid', gap: 20 }}>
      <h1>Gerenciar Despesas</h1>

      <label htmlFor="expense-user-id">User ID</label>
      <input
        id="expense-user-id"
        value={userId}
        onChange={(event) => setUserId(event.target.value)}
        placeholder="Informe o userId"
      />

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <input
          value={form.description}
          onChange={(event) => updateField('description', event.target.value)}
          placeholder="Descrição"
          required
        />
        <input
          type="number"
          step="0.01"
          value={form.amount}
          onChange={(event) => updateField('amount', event.target.value)}
          placeholder="Valor"
          required
        />
        <input
          value={form.category}
          onChange={(event) => updateField('category', event.target.value)}
          placeholder="Categoria"
          required
        />
        <input
          type="date"
          value={form.date}
          onChange={(event) => updateField('date', event.target.value)}
          required
        />
        <select
          value={form.paymentSource}
          onChange={(event) => updateField('paymentSource', event.target.value as ExpenseFormState['paymentSource'])}
        >
          <option value="cash">Dinheiro</option>
          <option value="checking">Conta</option>
          <option value="card">Cartão</option>
        </select>
        <input
          type="number"
          min="1"
          value={form.installments}
          onChange={(event) => updateField('installments', event.target.value)}
          placeholder="Parcelas"
          disabled={Boolean(editingId)}
        />
        <button type="submit" disabled={loading || !userId}>
          {editingId ? 'Salvar edição' : 'Criar despesa'}
        </button>
      </form>

      {error ? <p style={{ color: '#c00' }}>{error}</p> : null}
      {loading ? <p>Carregando...</p> : null}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Categoria</th>
            <th>Data</th>
            <th>Parcela</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.description}</td>
              <td>{item.amount}</td>
              <td>{item.category}</td>
              <td>{new Date(item.date).toLocaleDateString('pt-BR')}</td>
              <td>
                {item.installmentNumber}/{item.installments}
              </td>
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
