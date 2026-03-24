import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '@/models/User';

const MONGODB_URI = process.env.MONGODB_URI as string;

async function run() {
  await mongoose.connect(MONGODB_URI);

  const passwordHash = await bcrypt.hash("123456", 10);

  const user = await User.create({
    name: "Lucas",
    email: "lucas@email.com",
    passwordHash,
    role: "member",
  });

  console.log("Usuário criado:", user);

  await mongoose.disconnect();
}

run();