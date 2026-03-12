import { Types } from 'mongoose';
import { Income } from '@/models/Income';

type IncomeInput = {
  description: string;
  value: number;
  type: string;
  date: string;
  userId: string;
};

function validateIncomeInput(data: IncomeInput) {
  const { description, value, type, date, userId } = data;

  if (!description || value === undefined || !type || !date || !userId) {
    throw new Error('Todos os campos são obrigatórios.');
  }

  if (Number(value) < 0) {
    throw new Error('O valor da renda deve ser maior ou igual a zero.');
  }

  if (!Types.ObjectId.isValid(userId)) {
    throw new Error('userId inválido.');
  }
}

export async function createIncomeController(data: IncomeInput) {
  validateIncomeInput(data);

  const income = await Income.create({
    description: data.description,
    value: Number(data.value),
    type: data.type,
    date: new Date(data.date),
    userId: data.userId,
  });

  return income;
}

export async function listIncomesByMonthController(userId: string, year: number, month: number) {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error('userId inválido.');
  }

  if (!year || !month || month < 1 || month > 12) {
    throw new Error('Informe ano e mês válidos.');
  }

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  return Income.find({
    userId,
    date: {
      $gte: startDate,
      $lt: endDate,
    },
  }).sort({ date: -1 });
}

export async function updateIncomeController(incomeId: string, userId: string, data: Partial<IncomeInput>) {
  if (!Types.ObjectId.isValid(incomeId) || !Types.ObjectId.isValid(userId)) {
    throw new Error('IDs inválidos.');
  }

  const updateData: Record<string, unknown> = {};

  if (data.description !== undefined) updateData.description = data.description;
  if (data.value !== undefined) updateData.value = Number(data.value);
  if (data.type !== undefined) updateData.type = data.type;
  if (data.date !== undefined) updateData.date = new Date(data.date);

  const income = await Income.findOneAndUpdate(
    { _id: incomeId, userId },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!income) {
    throw new Error('Renda não encontrada.');
  }

  return income;
}

export async function deleteIncomeController(incomeId: string, userId: string) {
  if (!Types.ObjectId.isValid(incomeId) || !Types.ObjectId.isValid(userId)) {
    throw new Error('IDs inválidos.');
  }

  const deleted = await Income.findOneAndDelete({ _id: incomeId, userId });

  if (!deleted) {
    throw new Error('Renda não encontrada.');
  }

  return { message: 'Renda removida com sucesso.' };
}
