import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { loginController, registerController } from '@/controllers/authController';
import { log } from 'node:console';

export async function registerRoute(req: NextRequest) {
  await connectDB();
  const { name, email, password } = await req.json();

  try {
    const result = await registerController(name, email, password);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao registrar usuário.';
    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function loginRoute(req: NextRequest) {
  await connectDB();
  const { email, password } = await req.json();

  try {
    const result = await loginController(email, password);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro de autenticação.';
    return NextResponse.json({ message }, { status: 401 });
  }
}
