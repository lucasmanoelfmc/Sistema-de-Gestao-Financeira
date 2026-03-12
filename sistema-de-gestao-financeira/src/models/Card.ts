import { Schema, model, models, Types } from 'mongoose';

export interface ICard {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  name: string;
  type: 'credit' | 'debit';
  holderName: string;
  last4Digits: string;
  dueDay?: number;
}

const cardSchema = new Schema<ICard>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['credit', 'debit'], default: 'credit' },
    holderName: { type: String, required: true, trim: true },
    last4Digits: { type: String, required: true, match: /^\d{4}$/ },
    dueDay: { type: Number, min: 1, max: 31 },
  },
  { timestamps: true }
);

export const Card = models.Card || model<ICard>('Card', cardSchema);
