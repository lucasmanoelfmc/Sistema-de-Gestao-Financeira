import { NextRequest } from 'next/server';
import { deleteIncomeRoute, updateIncomeRoute } from '@/routes/incomeRoutes';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return updateIncomeRoute(request, id);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return deleteIncomeRoute(request, id);
}
