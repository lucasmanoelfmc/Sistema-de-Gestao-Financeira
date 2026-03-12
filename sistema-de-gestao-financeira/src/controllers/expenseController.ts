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

function addMonths(baseDate: Date, monthsToAdd: number) {
  const result = new Date(baseDate);
  result.setMonth(result.getMonth() + monthsToAdd);
  return result;
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

  if (!Types.ObjectId.isValid(user)) {
    throw new Error('Usuário inválido.');
  }

  if (card && !Types.ObjectId.isValid(card)) {
    throw new Error('Cartão inválido.');
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

  // Lógica de parcelamento:
  // 1) divide o valor em centavos pelo número de parcelas
  // 2) distribui eventual resto na última parcela
  // 3) cria registros para os meses seguintes
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
