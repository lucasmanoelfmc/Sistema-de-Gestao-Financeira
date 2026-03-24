'use client';

import { FormEvent, useEffect, useState } from 'react';

type CardItem = {
  _id: string;
  name: string;
  type: 'credit' | 'debit';
  holderName: string;
  last4Digits: string;
};

type CardFormState = {
  name: string;
  type: 'credit' | 'debit';
  holderName: string;
  last4Digits: string;
};

const DEFAULT_FORM: CardFormState = {
  name: '',
  type: 'credit',
  holderName: '',
  last4Digits: '',
};

export default function CardsManager() {
  const [userId, setUserId] = useState('');
  const [cards, setCards] = useState<CardItem[]>([]);
  const [form, setForm] = useState<CardFormState>(DEFAULT_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadCards(currentUserId: string) {
    if (!currentUserId) {
      setCards([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/cards?userId=${currentUserId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao carregar cartões.');
      }

      setCards(data);
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : 'Erro ao carregar cartões.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const savedUserId = localStorage.getItem('userId') || '';
    setUserId(savedUserId);
    void loadCards(savedUserId);
  }, []);

  function updateField<K extends keyof CardFormState>(field: K, value: CardFormState[K]) {
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
      };

      const response = await fetch(editingId ? `/api/cards/${editingId}` : '/api/cards', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? { ...payload, userId } : payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao salvar cartão.');
      }

      setForm(DEFAULT_FORM);
      setEditingId(null);
      await loadCards(userId);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Erro ao salvar cartão.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(card: CardItem) {
    setEditingId(card._id);
    setForm({
      name: card.name,
      type: card.type,
      holderName: card.holderName,
      last4Digits: card.last4Digits,
    });
  }

  async function handleDelete(id: string) {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/cards/${id}?userId=${userId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao remover cartão.');
      }

      await loadCards(userId);
    } catch (deleteError) {
      const message = deleteError instanceof Error ? deleteError.message : 'Erro ao remover cartão.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section style={{ display: 'grid', gap: 16 }}>
      <h1>Gerenciar Cartões</h1>

      <label htmlFor="cards-user-id">User ID</label>
      <input
        id="cards-user-id"
        value={userId}
        onChange={(event) => setUserId(event.target.value)}
        placeholder="Informe o userId"
      />

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10 }}>
        <input
          value={form.name}
          onChange={(event) => updateField('name', event.target.value)}
          placeholder="Nome"
          required
        />

        <select
          value={form.type}
          onChange={(event) => updateField('type', event.target.value as CardFormState['type'])}
        >
          <option value="credit">Crédito</option>
          <option value="debit">Débito</option>
        </select>

        <input
          value={form.holderName}
          onChange={(event) => updateField('holderName', event.target.value)}
          placeholder="Titular"
          required
        />

        <input
          value={form.last4Digits}
          onChange={(event) => updateField('last4Digits', event.target.value.replace(/\D/g, '').slice(0, 4))}
          placeholder="ID de 4 dígitos"
          required
        />

        <button type="submit" disabled={loading || !userId}>
          {editingId ? 'Salvar edição' : 'Cadastrar cartão'}
        </button>
      </form>

      {error ? <p style={{ color: '#c00' }}>{error}</p> : null}
      {loading ? <p>Carregando...</p> : null}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Titular</th>
            <th>ID 4 dígitos</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card) => (
            <tr key={card._id}>
              <td>{card.name}</td>
              <td>{card.type === 'credit' ? 'Crédito' : 'Débito'}</td>
              <td>{card.holderName}</td>
              <td>{card.last4Digits}</td>
              <td style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={() => handleEdit(card)}>
                  Editar
                </button>
                <button type="button" onClick={() => void handleDelete(card._id)}>
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