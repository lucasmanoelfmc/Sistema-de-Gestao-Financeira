import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '@/models/User';

export async function loginController(email: string, password: string) {
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new Error('Credenciais inválidas.');
  }

  const secret = process.env.JWT_SECRET as string;

  const token = jwt.sign(
    { email: user.email, role: user.role },
    secret,
    { subject: user.id, expiresIn: '1d' }
  );

  return { token };
}
