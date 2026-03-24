import { Types } from 'mongoose';
import { Card } from '@/models/Card';

type CardInput = {
  user: string;
  name: string;
  type: 'credit' | 'debit';
  holderName: string;
  last4Digits: string;
};

type CardUpdateInput = Partial<CardInput>;

function validateObjectId(id: string, fieldName: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(`${fieldName} inválido.`);
  }
}

function validateLast4Digits(last4Digits: string) {
  if (!/^\d{4}$/.test(last4Digits)) {
    throw new Error('ID de 4 dígitos inválido. Use exatamente 4 números.');
  }
}

export async function createCard(data: CardInput) {
  const { user, name, type, holderName, last4Digits } = data;

  if (!user || !name || !type || !holderName || !last4Digits) {
    throw new Error('Campos obrigatórios: user, name, type, holderName, last4Digits.');
  }

  validateObjectId(user, 'user');
  validateLast4Digits(last4Digits);

  return Card.create({
    user,
    name,
    type,
    holderName,
    last4Digits,
  });
}

export async function listCards(userId: string) {
  validateObjectId(userId, 'userId');
  return Card.find({ user: userId }).sort({ createdAt: -1 });
}

export async function updateCard(cardId: string, userId: string, data: CardUpdateInput) {
  validateObjectId(cardId, 'cardId');
  validateObjectId(userId, 'userId');

  const updateData: Record<string, unknown> = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.type !== undefined) updateData.type = data.type;
  if (data.holderName !== undefined) updateData.holderName = data.holderName;
  if (data.last4Digits !== undefined) {
    validateLast4Digits(data.last4Digits);
    updateData.last4Digits = data.last4Digits;
  }

  const card = await Card.findOneAndUpdate(
    { _id: cardId, user: userId },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!card) {
    throw new Error('Cartão não encontrado.');
  }

  return card;
}

export async function deleteCard(cardId: string, userId: string) {
  validateObjectId(cardId, 'cardId');
  validateObjectId(userId, 'userId');

  const deletedCard = await Card.findOneAndDelete({ _id: cardId, user: userId });

  if (!deletedCard) {
    throw new Error('Cartão não encontrado.');
  }

  return { message: 'Cartão removido com sucesso.' };
}