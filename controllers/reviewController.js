import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Field from '../models/Field.js';

export async function createReview(req, res) {
  const { bookingId, rating, comment } = req.body;

  const booking = await Booking.findById(bookingId).populate('field');
  if (!booking) return res.status(404).json({ msg: 'Booking not found' });

  if (booking.user.toString() !== req.user._id.toString())
    return res.status(403).json({ msg: 'You cannot review this booking' });

  const alreadyReviewed = await Review.findOne({ booking: bookingId });
  if (alreadyReviewed)
    return res.status(400).json({ msg: 'You already reviewed this booking' });

  // Chỉ cho phép đánh giá nếu đã sử dụng xong sân
  const now = new Date();
  const dateTimeStr = `${booking.date} ${booking.timeSlot.split('-')[1]}`;
  const bookingEnd = new Date(`${dateTimeStr}:00`);

  if (now < bookingEnd)
    return res.status(400).json({ msg: 'You can only review after using the field' });

  const review = await Review.create({
    field: booking.field._id,
    user: req.user._id,
    booking: booking._id,
    rating,
    comment,
  });

  // Cập nhật điểm trung bình của sân
  const reviews = await Review.find({ field: booking.field._id });
  const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  booking.field.averageRating = avg;
  booking.field.totalRatings = reviews.length;
  await booking.field.save();

  res.json({ msg: 'Review submitted', review });
}

export async function getReviewsForField(req, res) {
  const reviews = await Review.find({ field: req.params.fieldId })
    .populate('user', 'name')
    .sort({ createdAt: -1 });

  res.json(reviews);
}
