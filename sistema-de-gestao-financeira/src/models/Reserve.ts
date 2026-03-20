import { Schema, model, models, Types } from 'mongoose';
import { Model } from 'mongoose';

export interface IReserve {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  amount: number;
  date: Date;
  description: string;
  category: string;
  source?: string;
}

const reserveSchema = new Schema<IReserve>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true, index: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, default: 'Reserva', trim: true },
    source: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Reserve: Model<IReserve> =
  models.Reserve || model<IReserve>('Reserve', reserveSchema);