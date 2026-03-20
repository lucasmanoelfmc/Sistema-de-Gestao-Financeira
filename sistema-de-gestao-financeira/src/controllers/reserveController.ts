import { Types } from 'mongoose';
import { Reserve } from '@/models/Reserve';

type ReserveInput = {
  user: string;
  amount: number;
  date: string;
  description: string;
  category?: string;
  source?: string;
};

function validateObjectId(id: string, fieldName: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(`${fieldName} inválido.`);
  }
}

export async function createReserve(data: ReserveInput) {
  const { user, amount, date, description, category = 'Reserva', source } = data;

  if (!user || amount === undefined || !date || !description) {
    throw new Error('Campos obrigatórios: user, amount, date, description.');
  }

  validateObjectId(user, 'Usuário');

  if (amount < 0) {
    throw new Error('O valor do aporte deve ser maior ou igual a zero.');
  }

  const reserveDate = new Date(date);

  if (Number.isNaN(reserveDate.getTime())) {
    throw new Error('Data inválida.');
  }

  return Reserve.create({
    user,
    amount,
    date: reserveDate,
    description,
    category,
    source,
  });
}

export async function listReserves(userId: string) {
  validateObjectId(userId, 'userId');

  return Reserve.find({ user: userId }).sort({ date: 1, createdAt: 1 });
}

export async function updateReserve(reserveId: string, userId: string, data: Partial<ReserveInput>) {
  validateObjectId(reserveId, 'reserveId');
  validateObjectId(userId, 'userId');

  const updateData: Record<string, unknown> = {};

  if (data.amount !== undefined) updateData.amount = Number(data.amount);
  if (data.date !== undefined) updateData.date = new Date(data.date);
  if (data.description !== undefined) updateData.description = data.description;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.source !== undefined) updateData.source = data.source;

  const reserve = await Reserve.findOneAndUpdate(
    { _id: reserveId, user: userId },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!reserve) {
    throw new Error('Reserva não encontrada.');
  }

  return reserve;
}

export async function deleteReserve(reserveId: string, userId: string) {
  validateObjectId(reserveId, 'reserveId');
  validateObjectId(userId, 'userId');

  const deletedReserve = await Reserve.findOneAndDelete({ _id: reserveId, user: userId });

  if (!deletedReserve) {
    throw new Error('Reserva não encontrada.');
  }

  return { message: 'Reserva removida com sucesso.' };
}
