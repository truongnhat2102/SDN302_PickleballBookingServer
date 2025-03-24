import Booking from '../models/Booking.js';

export async function autoCancelUnpaidBookings() {
  const now = new Date();
  const threshold = new Date(now.getTime() - 15 * 60000); // 15 phút trước

  const bookings = await Booking.find({
    status: 'pending',
    paymentStatus: 'unpaid',
    createdAt: { $lt: threshold }
  });

  for (const booking of bookings) {
    booking.status = 'cancelled';
    await booking.save();
    console.log(`⛔ Booking ${booking._id} đã tự động hủy vì quá hạn thanh toán.`);
  }
}
