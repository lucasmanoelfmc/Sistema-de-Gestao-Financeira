import { Types } from 'mongoose';
import { Card } from '@/models/Card';
import { Installment } from '@/models/Installment';

type InstallmentInput = {
  user: string;
  card: string;
  description: string;
  totalAmount: number;
  installments: number;
  startDate: string;
};

type InstallmentUpdateInput = Partial<InstallmentInput>;

function validateObjectId(id: string, fieldName: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(`${fieldName} inválido.`);
  }
}

async function ensureCardExists(cardId: string, userId: string) {
  const card = await Card.findOne({ _id: cardId, user: userId });

  if (!card) {
    throw new Error('Cartão não encontrado para este usuário.');
  }

  return card;
}

export async function createInstallment(data: InstallmentInput) {
  const { user, card, description, totalAmount, installments, startDate } = data;

  if (!user || !card || !description || totalAmount === undefined || !installments || !startDate) {
    throw new Error('Campos obrigatórios: user, card, description, totalAmount, installments, startDate.');
  }

  validateObjectId(user, 'user');
  validateObjectId(card, 'card');

  if (Number(totalAmount) < 0 || Number(installments) < 1) {
    throw new Error('Valores de totalAmount/installments inválidos.');
  }

  await ensureCardExists(card, user);

  const monthlyAmount = Number(totalAmount) / Number(installments);

  return Installment.create({
    user,
    card,
    description,
    totalAmount: Number(totalAmount),
    installments: Number(installments),
    monthlyAmount,
    startDate: new Date(startDate),
  });
}

export async function listInstallments(userId: string) {
  validateObjectId(userId, 'userId');

  return Installment.find({ user: userId })
    .populate('card', 'name type holderName last4Digits')
    .sort({ createdAt: -1 });
}

export async function updateInstallment(installmentId: string, userId: string, data: InstallmentUpdateInput) {
  validateObjectId(installmentId, 'installmentId');
  validateObjectId(userId, 'userId');

  const updateData: Record<string, unknown> = {};

  if (data.card !== undefined) {
    validateObjectId(data.card, 'card');
    await ensureCardExists(data.card, userId);
    updateData.card = data.card;
  }

  if (data.description !== undefined) updateData.description = data.description;
  if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate);
  if (data.totalAmount !== undefined) updateData.totalAmount = Number(data.totalAmount);
  if (data.installments !== undefined) updateData.installments = Number(data.installments);

  const amount = (updateData.totalAmount ?? data.totalAmount) as number | undefined;
  const count = (updateData.installments ?? data.installments) as number | undefined;

  if (amount !== undefined && count !== undefined && count > 0) {
    updateData.monthlyAmount = amount / count;
  }

  const installment = await Installment.findOneAndUpdate(
    { _id: installmentId, user: userId },
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate('card', 'name type holderName last4Digits');

  if (!installment) {
    throw new Error('Parcelamento não encontrado.');
  }

  return installment;
}

export async function deleteInstallment(installmentId: string, userId: string) {
  validateObjectId(installmentId, 'installmentId');
  validateObjectId(userId, 'userId');

  const deletedInstallment = await Installment.findOneAndDelete({ _id: installmentId, user: userId });

  if (!deletedInstallment) {
    throw new Error('Parcelamento não encontrado.');
  }

  return { message: 'Parcelamento removido com sucesso.' };
}