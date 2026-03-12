import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import {
  createIncomeController,
  deleteIncomeController,
  listIncomesByMonthController,
  updateIncomeController,
} from '@/controllers/incomeController';

export async function createIncomeRoute(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const income = await createIncomeController(body);
    return NextResponse.json(income, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao criar renda.';
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function listIncomesByMonthRoute(req: NextRequest) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || '';
    const year = Number(searchParams.get('year'));
    const month = Number(searchParams.get('month'));

    const incomes = await listIncomesByMonthController(userId, year, month);
    return NextResponse.json(incomes, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao listar rendas.';
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function updateIncomeRoute(req: NextRequest, incomeId: string) {
  await connectDB();

  try {
    const body = await req.json();
    const userId = body.userId as string;

    const updatedIncome = await updateIncomeController(incomeId, userId, body);
    return NextResponse.json(updatedIncome, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao atualizar renda.';
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function deleteIncomeRoute(req: NextRequest, incomeId: string) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || '';

    const result = await deleteIncomeController(incomeId, userId);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao remover renda.';
    return NextResponse.json({ message }, { status: 400 });
  }
}
