import { NextRequest } from 'next/server';
import { getAnnualReportRoute } from '@/routes/reportRoutes';

export async function GET(request: NextRequest) {
  return getAnnualReportRoute(request);
}