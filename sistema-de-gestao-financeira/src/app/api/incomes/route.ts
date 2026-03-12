import { NextRequest } from 'next/server';
import { createIncomeRoute, listIncomesByMonthRoute } from '@/routes/incomeRoutes';

export async function POST(request: NextRequest) {
  return createIncomeRoute(request);
}

export async function GET(request: NextRequest) {
  return listIncomesByMonthRoute(request);
}
