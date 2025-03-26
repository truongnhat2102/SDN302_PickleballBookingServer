import { Schema, model } from 'mongoose';

const bookingSchema = new Schema({
  field: { type: Schema.Types.ObjectId, ref: 'Field' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  date: String, // định dạng: 'YYYY-MM-DD'
  timeSlot: [String], // ví dụ: '18:00-19:30'
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
}, { timestamps: true });

export default model('Booking', bookingSchema);
