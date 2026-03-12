import { Schema, model, models, Types } from 'mongoose';

export interface IIncome {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  amount: number;
  date: Date;
  description: string;
  category: string;
  installments: number;
  installmentId?: string;
}

const incomeSchema = new Schema<IIncome>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true, index: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, default: 'Outros', trim: true },
    installments: { type: Number, default: 1, min: 1 },
    installmentId: { type: String, index: true },
  },
  { timestamps: true }
);

export const Income = models.Income || model<IIncome>('Income', incomeSchema);
