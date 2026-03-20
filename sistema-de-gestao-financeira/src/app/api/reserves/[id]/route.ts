import { NextRequest } from 'next/server';
import { deleteReserveRoute, updateReserveRoute } from '@/routes/reserveRoutes';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return updateReserveRoute(request, id);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return deleteReserveRoute(request, id);
}