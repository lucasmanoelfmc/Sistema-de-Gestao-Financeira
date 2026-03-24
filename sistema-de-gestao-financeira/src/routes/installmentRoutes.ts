import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import {
  createInstallment,
  deleteInstallment,
  listInstallments,
  updateInstallment,
} from '@/controllers/installmentController';

export async function createInstallmentRoute(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const installment = await createInstallment(body);
    return NextResponse.json(installment, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao criar parcelamento.';
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function listInstallmentsRoute(req: NextRequest) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || '';

    const installments = await listInstallments(userId);
    return NextResponse.json(installments, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao listar parcelamentos.';
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function updateInstallmentRoute(req: NextRequest, installmentId: string) {
  await connectDB();

  try {
    const body = await req.json();
    const userId = body.userId as string;

    const installment = await updateInstallment(installmentId, userId, body);
    return NextResponse.json(installment, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao atualizar parcelamento.';
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function deleteInstallmentRoute(req: NextRequest, installmentId: string) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || '';

    const result = await deleteInstallment(installmentId, userId);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao remover parcelamento.';
    return NextResponse.json({ message }, { status: 400 });
  }
}