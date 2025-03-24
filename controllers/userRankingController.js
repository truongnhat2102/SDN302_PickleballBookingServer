import Booking from '../models/Booking.js';
import User from '../models/User.js';

export async function getUserRankings(req, res) {
  try {
    // Lấy tất cả người dùng
    const users = await User.find({ role: 'user' });

    const results = [];

    for (const user of users) {
      const bookings = await Booking.find({ user: user._id });

      const totalBookings = bookings.length;
      const completed = bookings.filter(
        b => b.status === 'confirmed' && b.paymentStatus === 'paid'
      ).length;

      const onTimeRate = totalBookings > 0 ? (completed / totalBookings) * 100 : 0;

      results.push({
        userId: user._id,
        name: user.name,
        email: user.email,
        totalBookings,
        completedBookings: completed,
        onTimeRate: parseFloat(onTimeRate.toFixed(2)),
      });
    }

    // Sắp xếp theo tỉ lệ đúng giờ và số lần đặt sân
    results.sort((a, b) => {
      if (b.onTimeRate === a.onTimeRate) {
        return b.totalBookings - a.totalBookings;
      }
      return b.onTimeRate - a.onTimeRate;
    });

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Lỗi khi tạo bảng xếp hạng người dùng' });
  }
}
