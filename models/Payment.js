import { Schema, model } from 'mongoose';

const paymentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
  amount: { type: Number, required: true }, // VNĐ
  vnpTxnRef: String, // Mã giao dịch VNPay
  vnpBankCode: String,
  vnpPayDate: String,
  status: { type: String, enum: ['success', 'failed'], default: 'success' },
}, { timestamps: true });

export default model('Payment', paymentSchema);
