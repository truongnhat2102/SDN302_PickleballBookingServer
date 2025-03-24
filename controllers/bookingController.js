import Booking from '../models/Booking.js';
import Field from '../models/Field.js';
import moment from 'moment';

// Đặt sân mới
export async function createBooking(req, res) {
  const { fieldId, date, timeSlot } = req.body;

  // 1. Kiểm tra sân có tồn tại không
  const field = await Field.findById(fieldId);
  if (!field) return res.status(404).json({ msg: 'Field not found' });

  // 2. Kiểm tra đã có lịch đặt chưa
  const existing = await Booking.findOne({ field: fieldId, date, timeSlot });
  if (existing) return res.status(400).json({ msg: 'Field already booked at this time' });

  // 3. Tạo booking
  const booking = await Booking.create({
    field: fieldId,
    user: req.user._id,
    date,
    timeSlot,
    status: 'pending',
    paymentStatus: 'unpaid',
  });

  res.json({ msg: 'Booking created', booking });
}

// Lấy các booking của người dùng
export async function getMyBookings(req, res) {
  const bookings = await Booking.find({ user: req.user._id }).populate('field');
  res.json(bookings);
}

// Hủy booking
export async function cancelBooking(req, res) {
  const bookingId = req.params.id;

  const booking = await Booking.findById(bookingId).populate('field');
  if (!booking) return res.status(404).json({ msg: 'Booking not found' });

  if (booking.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ msg: 'Not your booking' });
  }

  if (booking.status === 'cancelled') {
    return res.status(400).json({ msg: 'Booking already cancelled' });
  }

  // So sánh thời gian hiện tại và thời gian booking
  const now = moment();
  const bookingDateTime = moment(`${booking.date} ${booking.timeSlot.split('-')[0]}`, 'YYYY-MM-DD HH:mm');

  if (now.isAfter(bookingDateTime)) {
    return res.status(400).json({ msg: 'Cannot cancel past bookings' });
  }

  booking.status = 'cancelled';
  await booking.save();

  res.json({ msg: 'Booking cancelled', booking });
}
