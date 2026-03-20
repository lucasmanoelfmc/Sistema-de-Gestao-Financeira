import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { createReserve, deleteReserve, listReserves, updateReserve } from '@/controllers/reserveController';

export async function createReserveRoute(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const reserve = await createReserve(body);
    return NextResponse.json(reserve, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao criar aporte.';
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function listReservesRoute(req: NextRequest) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || '';

    const reserves = await listReserves(userId);
    return NextResponse.json(reserves, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao listar reservas.';
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function updateReserveRoute(req: NextRequest, reserveId: string) {
  await connectDB();

  try {
    const body = await req.json();
    const userId = body.userId as string;

    const reserve = await updateReserve(reserveId, userId, body);
    return NextResponse.json(reserve, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao atualizar aporte.';
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function deleteReserveRoute(req: NextRequest, reserveId: string) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || '';

    const result = await deleteReserve(reserveId, userId);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao remover aporte.';
    return NextResponse.json({ message }, { status: 400 });
  }
}