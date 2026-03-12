import { Schema, model, models, Types } from 'mongoose';

export interface IExpense {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  card?: Types.ObjectId;
  amount: number;
  date: Date;
  description: string;
  category: string;
  installments: number;
  installmentNumber: number;
  installmentId?: string;
  paymentSource: 'cash' | 'checking' | 'card';
}

const expenseSchema = new Schema<IExpense>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    card: { type: Schema.Types.ObjectId, ref: 'Card' },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true, index: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    installments: { type: Number, default: 1, min: 1 },
    installmentNumber: { type: Number, default: 1, min: 1 },
    installmentId: { type: String, index: true },
    paymentSource: { type: String, enum: ['cash', 'checking', 'card'], default: 'cash' },
  },
  { timestamps: true }
);

export const Expense = models.Expense || model<IExpense>('Expense', expenseSchema);
