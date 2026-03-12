import { NextRequest } from 'next/server';
import { getFutureDebtsRoute } from '@/routes/reportRoutes';

export async function GET(request: NextRequest) {
  return getFutureDebtsRoute(request);
}
