import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: string;
  // Add other fields as needed
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true },
  // Add other fields as needed
});

export const User = mongoose.model<IUser>('User', userSchema);