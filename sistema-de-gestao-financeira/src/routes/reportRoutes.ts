import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getMonthlyDashboardController } from '@/controllers/reportController';

export async function getMonthlyDashboardRoute(req: NextRequest) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const month = Number(searchParams.get('month'));
    const year = Number(searchParams.get('year'));
    const userId = searchParams.get('userId') || '';

    const dashboardData = await getMonthlyDashboardController({ month, year, userId });
    return NextResponse.json(dashboardData, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar dashboard mensal.';
    return NextResponse.json({ message }, { status: 400 });
  }
}
