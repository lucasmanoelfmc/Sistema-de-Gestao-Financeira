import jwt from 'jsonwebtoken';

export type JwtPayload = {
  sub: string;
  email: string;
  role: 'admin' | 'member';
};

export function verifyToken(token: string): JwtPayload {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('Defina a variável JWT_SECRET no ambiente.');
  }

  return jwt.verify(token, secret) as JwtPayload;
}
