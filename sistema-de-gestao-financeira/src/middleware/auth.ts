import { jwtVerify } from 'jose';

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