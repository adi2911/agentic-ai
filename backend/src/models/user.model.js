import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: { type: String, enum: ['admin', 'coach', 'user'], default: 'user' },
  },
  { timestamps: true },
);

export default model('User', userSchema);
