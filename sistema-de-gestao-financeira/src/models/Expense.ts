import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  user: mongoose.Types.ObjectId;
  card?: mongoose.Types.ObjectId;
  amount: number;
  date: Date;
  description: string;
  category: string;
  installments: number;
  installmentNumber: number;
  installmentId?: string;
  paymentSource: 'cash' | 'checking' | 'card';
}

const expenseSchema = new Schema<IExpense>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  card: { type: Schema.Types.ObjectId, ref: 'Card' },  // Assuming a Card model exists
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  installments: { type: Number, required: true, default: 1 },
  installmentNumber: { type: Number, required: true, default: 1 },
  installmentId: { type: String },
  paymentSource: { type: String, required: true, enum: ['cash', 'checking', 'card'], default: 'cash' },
});

export const Expense = mongoose.model<IExpense>('Expense', expenseSchema);