import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { createExpense } from '@/controllers/expenseController';

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
