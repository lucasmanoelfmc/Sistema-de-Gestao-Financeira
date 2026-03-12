import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'member';
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'member'] },
});

export const User = mongoose.model<IUser>('User', userSchema);