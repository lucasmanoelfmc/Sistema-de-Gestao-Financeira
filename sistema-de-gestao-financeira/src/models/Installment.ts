import { Schema, model, models, Types, Model } from 'mongoose';

export interface IInstallment {
  user: Types.ObjectId;
  card: Types.ObjectId;
  description: string;
  totalAmount: number;
  installments: number;
  monthlyAmount: number;
  startDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const installmentSchema = new Schema<IInstallment>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    card: { type: Schema.Types.ObjectId, ref: 'Card', required: true, index: true },
    description: { type: String, required: true, trim: true },
    totalAmount: { type: Number, required: true, min: 0 },
    installments: { type: Number, required: true, min: 1 },
    monthlyAmount: { type: Number, required: true, min: 0 },
    startDate: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

export const Installment: Model<IInstallment> =
  (models.Installment as Model<IInstallment>) ||
  model<IInstallment>('Installment', installmentSchema);