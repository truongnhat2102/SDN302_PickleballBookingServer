import { Schema, model } from 'mongoose';

const matchRequestSchema = new Schema({
  host: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  location: String,
  type: String, // loại sân: bóng đá, cầu lông...
  date: String, // 'YYYY-MM-DD'
  timeSlot: String, // '18:00-19:30'
  requiredPlayers: Number,
  currentPlayers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['open', 'matched', 'cancelled'], default: 'open' },
}, { timestamps: true });

export default model('MatchRequest', matchRequestSchema);
