import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import {
  getAnnualReportController,
  getFutureDebtsController,
  getMonthlyDashboardController,
} from '@/controllers/reportController';

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

export async function getFutureDebtsRoute(req: NextRequest) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || '';

    const futureDebtsData = await getFutureDebtsController(userId);
    return NextResponse.json(futureDebtsData, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar dívidas futuras.';
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function getAnnualReportRoute(req: NextRequest) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const year = Number(searchParams.get('year'));
    const userId = searchParams.get('userId') || '';

    const annualReportData = await getAnnualReportController(year, userId);
    return NextResponse.json(annualReportData, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar relatório anual.';
    return NextResponse.json({ message }, { status: 400 });
  }
}