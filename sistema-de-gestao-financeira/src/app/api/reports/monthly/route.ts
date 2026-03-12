import { NextRequest } from 'next/server';
import { getMonthlyDashboardRoute } from '@/routes/reportRoutes';

export async function GET(request: NextRequest) {
  return getMonthlyDashboardRoute(request);
}
