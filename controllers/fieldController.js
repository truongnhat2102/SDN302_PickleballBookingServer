import Field from '../models/Field.js';
import Booking from '../models/Booking.js';

export async function createField(req, res) {
  const field = await Field.create({ ...req.body, owner: req.user.id });
  res.json(field);
}

export async function updateField(req, res) {
  const field = await Field.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.id },
    req.body,
    { new: true }
  );
  if (!field) return res.status(404).json({ msg: 'Field not found or not yours' });
  res.json(field);
}

export async function getMyFields(req, res) {
  const fields = await Field.find({ owner: req.user.id });
  res.json(fields);
}

export async function getBookings(req, res) {
  const bookings = await Booking.find({}).populate('field').populate('user');
  const myBookings = bookings.filter(b => b.field.owner.toString() === req.user.id);
  res.json(myBookings);
}

export async function updateBookingStatus(req, res) {
  const booking = await Booking.findById(req.params.id).populate('field');
  if (!booking || booking.field.owner.toString() !== req.user.id)
    return res.status(403).json({ msg: 'Not authorized' });

  booking.status = req.body.status;
  await booking.save();
  res.json(booking);
}

export async function searchFields(req, res) {
  const { location, type, date, timeSlot, minPrice, maxPrice, amenities, sort } = req.query;

  let query = {};

  if (location) query.location = new RegExp(location, 'i');
  if (type) query.type = type;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseInt(minPrice);
    if (maxPrice) query.price.$lte = parseInt(maxPrice);
  }
  if (amenities) {
    const list = Array.isArray(amenities) ? amenities : [amenities];
    query.amenities = { $all: list };
  }

  let bookedFieldIds = [];
  if (date && timeSlot) {
    const bookings = await Booking.find({ date, timeSlot });
    bookedFieldIds = bookings.map(b => b.field.toString());
  }

  if (bookedFieldIds.length > 0) {
    query._id = { $nin: bookedFieldIds };
  }

  let sortOption = {};
  if (sort === 'price_asc') sortOption.price = 1;
  else if (sort === 'price_desc') sortOption.price = -1;
  else if (sort === 'rating') sortOption.averageRating = -1;

  const fields = await Field.find(query).sort(sortOption);

  res.json(fields);
}
