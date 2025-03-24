import { Schema, model } from 'mongoose';

const reviewSchema = new Schema({
  field: { type: Schema.Types.ObjectId, ref: 'Field', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
}, { timestamps: true });

export default model('Review', reviewSchema);
