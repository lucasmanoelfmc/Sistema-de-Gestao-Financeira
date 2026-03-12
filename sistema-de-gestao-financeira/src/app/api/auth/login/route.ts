import { loginRoute } from '@/routes/authRoutes';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  return loginRoute(request);
}