import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/middleware/auth';

function unauthorizedResponse() {
  return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
}

export function middleware(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return unauthorizedResponse();
  }

  const token = authHeader.replace('Bearer ', '').trim();

  if (!token) {
    return unauthorizedResponse();
  }

  try {
    verifyToken(token);
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
