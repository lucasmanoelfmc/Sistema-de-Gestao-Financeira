import { NextRequest } from 'next/server';
import { registerRoute } from '@/routes/authRoutes';

export async function POST(request: NextRequest) {
  return registerRoute(request);
}
