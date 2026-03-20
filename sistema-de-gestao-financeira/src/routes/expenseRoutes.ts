import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { createExpense, deleteExpense, listExpensesByMonth, updateExpense } from '@/controllers/expenseController';

export async function createExpenseRoute(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const expense = await createExpense(body);
    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao criar despesa.';
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function listExpensesByMonthRoute(req: NextRequest) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || '';
    const year = Number(searchParams.get('year'));
    const month = Number(searchParams.get('month'));

    const expenses = await listExpensesByMonth(userId, year, month);
    return NextResponse.json(expenses, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao listar despesas.';
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function updateExpenseRoute(req: NextRequest, expenseId: string) {
  await connectDB();

  try {
    const body = await req.json();
    const userId = body.userId as string;

    const expense = await updateExpense(expenseId, userId, body);
    return NextResponse.json(expense, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao atualizar despesa.';
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function deleteExpenseRoute(req: NextRequest, expenseId: string) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || '';

    const result = await deleteExpense(expenseId, userId);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao remover despesa.';
    return NextResponse.json({ message }, { status: 400 });
  }
}
