import Payment from '../models/Payment.js';

export async function getMyPayments(req, res) {
  const payments = await Payment.find({ user: req.user._id })
    .populate('booking')
    .sort({ createdAt: -1 });

  res.json(payments);
}
