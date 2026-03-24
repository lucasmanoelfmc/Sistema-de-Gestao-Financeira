import { NextRequest } from 'next/server';
import { deleteCardRoute, updateCardRoute } from '@/routes/cardRoutes';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return updateCardRoute(request, id);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return deleteCardRoute(request, id);
}