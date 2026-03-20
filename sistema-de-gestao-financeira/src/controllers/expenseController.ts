import { randomUUID } from 'crypto';
import { Types } from 'mongoose';
import { Expense } from '@/models/Expense';

type CreateExpenseInput = {
  user: string;
  card?: string;
  amount: number;
  date: string;
  description: string;
  category: string;
  installments?: number;
  paymentSource?: 'cash' | 'checking' | 'card';
};

type UpdateExpenseInput = Partial<CreateExpenseInput>;

function addMonths(baseDate: Date, monthsToAdd: number) {
  const result = new Date(baseDate);
  result.setMonth(result.getMonth() + monthsToAdd);
  return result;
}

function validateObjectId(id: string, fieldName: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(`${fieldName} inválido.`);
  }
}

export async function createExpense(data: CreateExpenseInput) {
  const {
    user,
    card,
    amount,
    date,
    description,
    category,
    installments = 1,
    paymentSource = 'cash',
  } = data;

  if (!user || !amount || !date || !description || !category) {
    throw new Error('Campos obrigatórios: user, amount, date, description, category.');
  }

  validateObjectId(user, 'Usuário');

  if (card) {
    validateObjectId(card, 'Cartão');
  }

  if (amount < 0) {
    throw new Error('O valor da despesa deve ser maior ou igual a zero.');
  }

  if (!Number.isInteger(installments) || installments < 1) {
    throw new Error('installments deve ser um número inteiro maior que 0.');
  }

  const expenseDate = new Date(date);

  if (Number.isNaN(expenseDate.getTime())) {
    throw new Error('Data inválida.');
  }

  if (installments === 1) {
    return Expense.create({
      user,
      card,
      amount,
      date: expenseDate,
      description,
      category,
      installments: 1,
      installmentNumber: 1,
      paymentSource,
    });
  }

  const groupInstallmentId = randomUUID();
  const totalInCents = Math.round(amount * 100);
  const baseInstallmentInCents = Math.floor(totalInCents / installments);
  const remainderInCents = totalInCents - baseInstallmentInCents * installments;

  const installmentDocs = Array.from({ length: installments }, (_, index) => {
    const isLastInstallment = index === installments - 1;
    const installmentInCents =
      baseInstallmentInCents + (isLastInstallment ? remainderInCents : 0);

    return {
      user,
      card,
      amount: installmentInCents / 100,
      date: addMonths(expenseDate, index),
      description,
      category,
      installments,
      installmentNumber: index + 1,
      installmentId: groupInstallmentId,
      paymentSource,
    };
  });

  return Expense.insertMany(installmentDocs);
}

export async function listExpensesByMonth(userId: string, year: number, month: number) {
  validateObjectId(userId, 'userId');

  if (!year || !month || month < 1 || month > 12) {
    throw new Error('Informe ano e mês válidos.');
  }

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  return Expense.find({
    user: userId,
    date: {
      $gte: startDate,
      $lt: endDate,
    },
  }).sort({ date: -1, createdAt: -1 });
}

export async function updateExpense(expenseId: string, userId: string, data: UpdateExpenseInput) {
  validateObjectId(expenseId, 'expenseId');
  validateObjectId(userId, 'userId');

  const updateData: Record<string, unknown> = {};

  if (data.description !== undefined) updateData.description = data.description;
  if (data.amount !== undefined) updateData.amount = Number(data.amount);
  if (data.category !== undefined) updateData.category = data.category;
  if (data.date !== undefined) updateData.date = new Date(data.date);
  if (data.paymentSource !== undefined) updateData.paymentSource = data.paymentSource;
  if (data.card !== undefined) updateData.card = data.card || undefined;

  const expense = await Expense.findOneAndUpdate(
    { _id: expenseId, user: userId },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!expense) {
    throw new Error('Despesa não encontrada.');
  }

  return expense;
}

export async function deleteExpense(expenseId: string, userId: string) {
  validateObjectId(expenseId, 'expenseId');
  validateObjectId(userId, 'userId');

  const deletedExpense = await Expense.findOneAndDelete({ _id: expenseId, user: userId });

  if (!deletedExpense) {
    throw new Error('Despesa não encontrada.');
  }

  return { message: 'Despesa removida com sucesso.' };
}
