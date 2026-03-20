import { NextRequest } from 'next/server';
import { createExpenseRoute, listExpensesByMonthRoute } from '@/routes/expenseRoutes';

export async function POST(request: NextRequest) {
  return createExpenseRoute(request);
}

export async function GET(request: NextRequest) {
  return listExpensesByMonthRoute(request);
}
