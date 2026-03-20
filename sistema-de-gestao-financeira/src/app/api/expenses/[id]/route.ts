import { NextRequest } from 'next/server';
import { deleteExpenseRoute, updateExpenseRoute } from '@/routes/expenseRoutes';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return updateExpenseRoute(request, id);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return deleteExpenseRoute(request, id);
}
