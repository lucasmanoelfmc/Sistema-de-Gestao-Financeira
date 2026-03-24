'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import ExportDataButton from '@/components/export/ExportDataButton';

type IncomeItem = {
  _id: string;
  description: string;
  value: number;
  type: string;
  date: string;
  userId: string;
};

type IncomeFormState = {
  description: string;
  value: string;
  type: string;
  date: string;
};

const DEFAULT_FORM: IncomeFormState = {
  description: '',
  value: '',
  type: 'salário',
  date: new Date().toISOString().slice(0, 10),
};

export default function IncomesManager() {
  const [userId, setUserId] = useState('');
  const [items, setItems] = useState<IncomeItem[]>([]);
  const [form, setForm] = useState<IncomeFormState>(DEFAULT_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentDate = useMemo(() => new Date(), []);
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  const exportRows = useMemo(
    () =>
      items.map((item) => ({
        descricao: item.description,
        valor: item.value,
        tipo: item.type,
        data: new Date(item.date).toLocaleDateString('pt-BR'),
      })),
    [items]
  );

  async function loadIncomes(selectedUserId: string) {
    if (!selectedUserId) {
      setItems([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `/api/incomes?userId=${selectedUserId}&month=${month}&year=${year}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao carregar rendas.');
      }

      setItems(data);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : 'Erro ao carregar rendas.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const savedUserId = localStorage.getItem('userId') || '';
    setUserId(savedUserId);
    void loadIncomes(savedUserId);
  }, [month, year]);

  function updateField<K extends keyof IncomeFormState>(field: K, value: IncomeFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...form,
        value: Number(form.value),
        userId,
      };

      const response = await fetch(editingId ? `/api/incomes/${editingId}` : '/api/incomes', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao salvar renda.');
      }

      setForm(DEFAULT_FORM);
      setEditingId(null);
      await loadIncomes(userId);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Erro ao salvar renda.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(item: IncomeItem) {
    setEditingId(item._id);
    setForm({
      description: item.description,
      value: String(item.value),
      type: item.type,
      date: item.date.slice(0, 10),
    });
  }

  async function handleDelete(id: string) {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/incomes/${id}?userId=${userId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao deletar renda.');
      }

      await loadIncomes(userId);
    } catch (deleteError) {
      const message = deleteError instanceof Error ? deleteError.message : 'Erro ao deletar renda.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section style={{ display: 'grid', gap: 20 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <h1 style={{ margin: 0 }}>Gerenciar Rendas</h1>
        <ExportDataButton fileBaseName="rendas" title="Exportação de Rendas" rows={exportRows} />
      </header>

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
          value={form.value}
          onChange={(event) => updateField('value', event.target.value)}
          placeholder="Valor"
          required
        />
        <input
          value={form.type}
          onChange={(event) => updateField('type', event.target.value)}
          placeholder="Tipo"
          required
        />
        <input
          type="date"
          value={form.date}
          onChange={(event) => updateField('date', event.target.value)}
          required
        />
        <button type="submit" disabled={loading || !userId}>
          {editingId ? 'Salvar edição' : 'Criar renda'}
        </button>
      </form>

      {error ? <p style={{ color: '#c00' }}>{error}</p> : null}
      {loading ? <p>Carregando...</p> : null}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Tipo</th>
            <th>Data</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.description}</td>
              <td>{item.value}</td>
              <td>{item.type}</td>
              <td>{new Date(item.date).toLocaleDateString('pt-BR')}</td>
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
