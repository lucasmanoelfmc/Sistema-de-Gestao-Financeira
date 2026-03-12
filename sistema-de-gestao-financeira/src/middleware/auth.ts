import jwt from 'jsonwebtoken';

export type JwtPayload = {
  userId: string;
  sub: string;
  iat: number;
  exp: number;
};

export function verifyToken(token: string): JwtPayload {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('Defina a variável JWT_SECRET no ambiente.');
  }

  return jwt.verify(token, secret) as JwtPayload;
}

