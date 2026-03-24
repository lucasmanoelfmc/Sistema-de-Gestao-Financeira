import { NextRequest } from 'next/server';
import { deleteInstallmentRoute, updateInstallmentRoute } from '@/routes/installmentRoutes';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return updateInstallmentRoute(request, id);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return deleteInstallmentRoute(request, id);
}