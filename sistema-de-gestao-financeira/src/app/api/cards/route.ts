import { NextRequest } from 'next/server';
import { createCardRoute, listCardsRoute } from '@/routes/cardRoutes';

export async function POST(request: NextRequest) {
  return createCardRoute(request);
}

export async function GET(request: NextRequest) {
  return listCardsRoute(request);
}