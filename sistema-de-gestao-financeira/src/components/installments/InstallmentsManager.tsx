'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import ExportDataButton from '@/components/export/ExportDataButton';

type CardItem = {
  _id: string;
  name: string;
  type: 'credit' | 'debit';
  holderName: string;
  last4Digits: string;
};

type InstallmentItem = {
  _id: string;
  description: string;
  totalAmount: number;
  installments: number;
  monthlyAmount: number;
  startDate: string;
  card: CardItem;
};

type InstallmentFormState = {
  card: string;
  description: string;
  totalAmount: string;
  installments: string;
  startDate: string;
};

const DEFAULT_FORM: InstallmentFormState = {
  card: '',
  description: '',
  totalAmount: '',
  installments: '1',
  startDate: new Date().toISOString().slice(0, 10),
};

export default function InstallmentsManager() {
  const [userId, setUserId] = useState('');
  const [cards, setCards] = useState<CardItem[]>([]);
  const [items, setItems] = useState<InstallmentItem[]>([]);
  const [form, setForm] = useState<InstallmentFormState>(DEFAULT_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const exportRows = useMemo(
    () =>
      items.map((item) => ({
        descricao: item.description,
        cartao: `${item.card?.name || ''} (${item.card?.last4Digits || ''})`,
        valor_total: item.totalAmount,
        parcelas: item.installments,
        valor_mensal: item.monthlyAmount.toFixed(2),
        inicio: new Date(item.startDate).toLocaleDateString('pt-BR'),
      })),
    [items]
  );

  async function loadCards(currentUserId: string) {
    if (!currentUserId) {
      setCards([]);
      return;
    }

    const response = await fetch(`/api/cards?userId=${currentUserId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao carregar cartões.');
    }

    setCards(data);

    if (!form.card && data.length > 0) {
      setForm((current) => ({ ...current, card: data[0]._id }));
    }
  }

  async function loadInstallments(currentUserId: string) {
    if (!currentUserId) {
      setItems([]);
      return;
    }

    const response = await fetch(`/api/installments?userId=${currentUserId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao carregar parcelamentos.');
    }

    setItems(data);
  }

  async function refreshAll(currentUserId: string) {
    if (!currentUserId) {
      setCards([]);
      setItems([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await Promise.all([loadCards(currentUserId), loadInstallments(currentUserId)]);
    } catch (refreshError) {
      const message = refreshError instanceof Error ? refreshError.message : 'Erro ao carregar dados.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const savedUserId = localStorage.getItem('userId') || '';
    setUserId(savedUserId);
    void refreshAll(savedUserId);
  }, []);

  function updateField<K extends keyof InstallmentFormState>(field: K, value: InstallmentFormState[K]) {
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
        totalAmount: Number(form.totalAmount),
        installments: Number(form.installments),
      };

      const response = await fetch(editingId ? `/api/installments/${editingId}` : '/api/installments', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { ...payload, userId } : payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao salvar parcelamento.');
      }

      setForm((current) => ({ ...DEFAULT_FORM, card: current.card || form.card }));
      setEditingId(null);
      await refreshAll(userId);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Erro ao salvar parcelamento.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(item: InstallmentItem) {
    setEditingId(item._id);
    setForm({
      card: item.card?._id || '',
      description: item.description,
      totalAmount: String(item.totalAmount),
      installments: String(item.installments),
      startDate: item.startDate.slice(0, 10),
    });
  }

  async function handleDelete(id: string) {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/installments/${id}?userId=${userId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao remover parcelamento.');
      }

      await refreshAll(userId);
    } catch (deleteError) {
      const message = deleteError instanceof Error ? deleteError.message : 'Erro ao remover parcelamento.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section style={{ display: 'grid', gap: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <h1 style={{ margin: 0 }}>Gerenciar Parcelamentos</h1>
        <ExportDataButton fileBaseName="parcelamentos" title="Exportação de Parcelamentos" rows={exportRows} />
      </header>

      <label htmlFor="installments-user-id">User ID</label>
      <input
        id="installments-user-id"
        value={userId}
        onChange={(event) => setUserId(event.target.value)}
        placeholder="Informe o userId"
      />

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10 }}>
        <select
          value={form.card}
          onChange={(event) => updateField('card', event.target.value)}
          required
        >
          <option value="">Selecione um cartão</option>
          {cards.map((card) => (
            <option key={card._id} value={card._id}>
              {card.name} ({card.last4Digits}) - {card.type === 'credit' ? 'Crédito' : 'Débito'}
            </option>
          ))}
        </select>

        <input
          value={form.description}
          onChange={(event) => updateField('description', event.target.value)}
          placeholder="Descrição do parcelamento"
          required
        />

        <input
          type="number"
          step="0.01"
          value={form.totalAmount}
          onChange={(event) => updateField('totalAmount', event.target.value)}
          placeholder="Valor total"
          required
        />

        <input
          type="number"
          min="1"
          value={form.installments}
          onChange={(event) => updateField('installments', event.target.value)}
          placeholder="Quantidade de parcelas"
          required
        />

        <input
          type="date"
          value={form.startDate}
          onChange={(event) => updateField('startDate', event.target.value)}
          required
        />

        <button type="submit" disabled={loading || !userId}>
          {editingId ? 'Salvar edição' : 'Cadastrar parcelamento'}
        </button>
      </form>

      {error ? <p style={{ color: '#c00' }}>{error}</p> : null}
      {loading ? <p>Carregando...</p> : null}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Cartão</th>
            <th>Valor total</th>
            <th>Parcelas</th>
            <th>Valor mensal</th>
            <th>Início</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.description}</td>
              <td>
                {item.card?.name} ({item.card?.last4Digits})
              </td>
              <td>{item.totalAmount}</td>
              <td>{item.installments}</td>
              <td>{item.monthlyAmount.toFixed(2)}</td>
              <td>{new Date(item.startDate).toLocaleDateString('pt-BR')}</td>
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
