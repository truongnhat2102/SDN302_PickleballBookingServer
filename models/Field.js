import { Schema, model } from 'mongoose';

const fieldSchema = new Schema({
    name: String,
    type: String, // ví dụ: 'bóng đá 5 người', 'cầu lông'
    location: String,
    price: Number,
    images: [String],
    description: String,
    amenities: [String],
    status: { type: String, enum: ['available', 'unavailable'], default: 'available' },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
}, { timestamps: true });

export default model('Field', fieldSchema);
