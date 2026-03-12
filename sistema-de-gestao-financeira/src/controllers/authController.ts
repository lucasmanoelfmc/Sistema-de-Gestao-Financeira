import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '@/models/User';

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('Defina a variável JWT_SECRET no ambiente.');
  }

  return secret;
}

export function generateToken(userId: string) {
  const secret = getJwtSecret();

  return jwt.sign({ userId }, secret, {
    subject: userId,
    expiresIn: '1d',
  });
}

function buildAuthUser(user: {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
}): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function registerController(name: string, email: string, password: string) {
  if (!name || !email || !password) {
    throw new Error('Nome, email e senha são obrigatórios.');
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error('Email já cadastrado.');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    passwordHash,
  });

  const token = generateToken(user.id);

  return {
    token,
    user: buildAuthUser(user),
  };
}

export async function loginController(email: string, password: string) {
  if (!email || !password) {
    throw new Error('Email e senha são obrigatórios.');
  }

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new Error('Credenciais inválidas.');
  }

  const token = generateToken(user.id);

  return {
    token,
    user: buildAuthUser(user),
  };
}

