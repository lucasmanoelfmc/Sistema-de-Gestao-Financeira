import { NextRequest } from 'next/server';
import { createInstallmentRoute, listInstallmentsRoute } from '@/routes/installmentRoutes';

export async function POST(request: NextRequest) {
  return createInstallmentRoute(request);
}

export async function GET(request: NextRequest) {
  return listInstallmentsRoute(request);
}