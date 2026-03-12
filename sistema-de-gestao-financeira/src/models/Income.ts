import mongoose, { Schema, Document } from 'mongoose';

export interface IIncome extends Document {
  description: string;
  value: number;
  type: string;
  date: Date;
  userId: mongoose.Types.ObjectId;
}

const incomeSchema = new Schema<IIncome>({
  description: { type: String, required: true },
  value:       { type: Number, required: true },
  type:        { type: String, required: true },
  date:        { type: Date,   required: true },
  userId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export const Income = mongoose.model<IIncome>('Income', incomeSchema);