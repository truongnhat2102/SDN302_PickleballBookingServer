import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Field from '../models/Field.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import MatchRequest from '../models/MatchRequest.js';

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log('✅ Connected to MongoDB');

// 1. Xoá dữ liệu cũ (cẩn thận khi dùng!)
await Promise.all([
  User.deleteMany(),
  Field.deleteMany(),
  Booking.deleteMany(),
  Review.deleteMany(),
  MatchRequest.deleteMany(),
]);

// 2. Tạo user mẫu
const password = await bcrypt.hash('123456', 10);
const users = await User.insertMany([
  { name: 'Alice', email: 'alice@example.com', password, role: 'user' },
  { name: 'Bob', email: 'bob@example.com', password, role: 'user' },
  { name: 'Charlie', email: 'charlie@example.com', password, role: 'manager' },
]);

// 3. Tạo sân mẫu
const fields = await Field.insertMany([
  {
    name: 'Sân A',
    location: 'Quận 1',
    type: 'Trong nhà',
    price: 100000,
    owner: users[2]._id,
    amenities: ['đèn', 'wifi'],
    averageRating: 4.5,
    totalRatings: 2,
  },
  {
    name: 'Sân B',
    location: 'Quận 2',
    type: 'Ngoài trời',
    price: 80000,
    owner: users[2]._id,
    amenities: ['đèn'],
    averageRating: 4.0,
    totalRatings: 1,
  },
]);

// 4. Tạo booking mẫu
const bookings = await Booking.insertMany([
  {
    field: fields[0]._id,
    user: users[0]._id,
    date: '2025-03-25',
    timeSlot: '09:00-10:00',
    status: 'confirmed',
    paymentStatus: 'paid',
  },
  {
    field: fields[1]._id,
    user: users[1]._id,
    date: '2025-03-26',
    timeSlot: '16:00-17:00',
    status: 'pending',
    paymentStatus: 'unpaid',
  },
]);

// 5. Tạo review mẫu
await Review.insertMany([
  {
    field: fields[0]._id,
    user: users[0]._id,
    booking: bookings[0]._id,
    rating: 5,
    comment: 'Sân rất sạch và đèn sáng.',
  },
]);

// 6. Tạo yêu cầu ghép trận
await MatchRequest.insertMany([
  {
    host: users[0]._id,
    location: 'Quận 1',
    type: 'Trong nhà',
    date: '2025-03-27',
    timeSlot: '18:00-19:00',
    requiredPlayers: 4,
    currentPlayers: [users[0]._id],
    status: 'open',
  },
]);

console.log('✅ Seed data inserted!');
process.exit();
