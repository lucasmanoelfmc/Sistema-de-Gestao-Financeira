import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { createCard, deleteCard, listCards, updateCard } from '@/controllers/cardController';

export async function createCardRoute(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const card = await createCard(body);
    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao criar cartão.';
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function listCardsRoute(req: NextRequest) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || '';

    const cards = await listCards(userId);
    return NextResponse.json(cards, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao listar cartões.';
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function updateCardRoute(req: NextRequest, cardId: string) {
  await connectDB();

  try {
    const body = await req.json();
    const userId = body.userId as string;

    const card = await updateCard(cardId, userId, body);
    return NextResponse.json(card, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao atualizar cartão.';
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function deleteCardRoute(req: NextRequest, cardId: string) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || '';

    const result = await deleteCard(cardId, userId);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao remover cartão.';
    return NextResponse.json({ message }, { status: 400 });
  }
}