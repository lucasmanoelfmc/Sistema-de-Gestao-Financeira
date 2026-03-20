import { NextRequest } from 'next/server';
import { createReserveRoute, listReservesRoute } from '@/routes/reserveRoutes';

export async function POST(request: NextRequest) {
  return createReserveRoute(request);
}

export async function GET(request: NextRequest) {
  return listReservesRoute(request);
}