import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { loginController } from '@/controllers/authController';

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
