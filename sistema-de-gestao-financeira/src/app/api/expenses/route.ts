import { NextRequest } from 'next/server';
import { createExpenseRoute } from '@/routes/expenseRoutes';

export async function POST(request: NextRequest) {
  return createExpenseRoute(request);
}
