import { NextRequest, NextResponse } from 'next/server';
//import { verifyToken } from '@/middleware/auth';
import { jwtVerify } from 'jose';

function unauthorizedResponse() {
  return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
}

export type JwtPayload = {
  userId: string;
  sub: string;
  iat: number;
  exp: number;
};

export async function verifyToken(token: string): Promise<JwtPayload> {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('Defina a variável JWT_SECRET no ambiente.');
  }

  const encoder = new TextEncoder();
  const { payload } = await jwtVerify(token, encoder.encode(secret));

  return payload as JwtPayload;
}

export async function middleware(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return unauthorizedResponse();
  }

  const token = authHeader.replace('Bearer ', '').trim();

  if (!token) {
    return unauthorizedResponse();
  }

  try {
    await verifyToken(token);
    return NextResponse.next();
  } catch {
    return unauthorizedResponse();
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/users/:path*',
    '/api/incomes/:path*',
    '/api/expenses/:path*',
    '/api/reserves/:path*',
    '/api/cards/:path*',
    '/api/reports/:path*',
  ],
};
