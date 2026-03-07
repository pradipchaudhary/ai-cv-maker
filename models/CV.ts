import mongoose, { Schema, Document } from 'mongoose';

export interface ICV extends Document {
  fullName: string;
  email: string;
  phone: string;
  passportNumber: string;
  applyingFor: string;
  fullData: string; // Store as JSON string
  createdAt: Date;
}

const CVSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  passportNumber: { type: String, required: true },
  applyingFor: { type: String, required: true },
  fullData: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.CV || mongoose.model<ICV>('CV', CVSchema);
