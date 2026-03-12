import { Types } from 'mongoose';
import { Income } from '@/models/Income';
import { Expense } from '@/models/Expense';

type MonthlyDashboardInput = {
  month: number;
  year: number;
  userId: string;
};

export async function getMonthlyDashboardController({ month, year, userId }: MonthlyDashboardInput) {
  if (!month || !year || month < 1 || month > 12) {
    throw new Error('Informe month e year válidos.');
  }

  if (!userId || !Types.ObjectId.isValid(userId)) {
    throw new Error('Informe um userId válido.');
  }

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  const [incomeAgg, expenseAgg, expensesByCategory, top5Expenses] = await Promise.all([
    Income.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: '$value' },
        },
      },
    ]),
    Expense.aggregate([
      {
        $match: {
          user: new Types.ObjectId(userId),
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalExpense: { $sum: '$amount' },
        },
      },
    ]),
    Expense.aggregate([
      {
        $match: {
          user: new Types.ObjectId(userId),
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          total: 1,
        },
      },
      { $sort: { total: -1 } },
    ]),
    Expense.find({
      user: userId,
      date: { $gte: startDate, $lt: endDate },
    })
      .sort({ amount: -1 })
      .limit(5)
      .select('description category amount date installmentNumber installments installmentId'),
  ]);

  const totalIncome = incomeAgg[0]?.totalIncome ?? 0;
  const totalExpense = expenseAgg[0]?.totalExpense ?? 0;

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    expensesByCategory,
    top5Expenses,
  };
}
