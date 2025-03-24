// controllers/vnpayController.js
import moment from 'moment';
import { createHmac } from 'crypto';
import { stringify } from 'qs';

import Booking from '../models/Booking.js';
import Field from '../models/Field.js';
import Payment from '../models/Payment.js';
import { sendBookingConfirmation } from '../utils/email.js';

// Sort object by key
function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (let key of keys) sorted[key] = obj[key];
  return sorted;
}

// Tạo URL thanh toán
export async function createPaymentUrl(req, res) {
  try {
    const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate('field');
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });

    const amount = booking.field.price;

    const tmnCode = process.env.VNP_TMNCODE;
    const secretKey = process.env.VNP_HASHSECRET;
    const vnpUrl = process.env.VNP_URL;
    const returnUrl = `${process.env.VNP_RETURNURL}?bookingId=${booking._id}`;

    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const orderId = moment(date).format('HHmmss');

    let vnp_Params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: `Thanh toan dat san ${booking._id}`,
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    vnp_Params = sortObject(vnp_Params);
    const signData = stringify(vnp_Params, { encode: false });
    const hmac = createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    vnp_Params.vnp_SecureHash = signed;
    const paymentUrl = `${vnpUrl}?${stringify(vnp_Params, { encode: false })}`;

    res.json({ paymentUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal server error' });
  }
}

// Xử lý trả về từ VNPay
export async function paymentReturn(req, res) {
  try {
    const vnp_Params = { ...req.query };
    const secureHash = vnp_Params.vnp_SecureHash;
    const bookingId = vnp_Params.bookingId;

    delete vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHashType;

    const sorted = sortObject(vnp_Params);
    const signData = stringify(sorted, { encode: false });
    const hmac = createHmac('sha512', process.env.VNP_HASHSECRET);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash === signed && vnp_Params.vnp_ResponseCode === '00') {
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        {
          paymentStatus: 'paid',
          status: 'confirmed'
        },
        { new: true }
      ).populate('field user');

      // Ghi log thanh toán
      await Payment.create({
        user: booking.user._id,
        booking: booking._id,
        amount: booking.field.price,
        vnpTxnRef: req.query.vnp_TxnRef,
        vnpBankCode: req.query.vnp_BankCode,
        vnpPayDate: req.query.vnp_PayDate,
        status: 'success'
      });

      // Gửi email xác nhận
      await sendBookingConfirmation(booking.user.email, {
        field: booking.field,
        date: booking.date,
        timeSlot: booking.timeSlot
      });

      return res.redirect(`${process.env.CLIENT_SUCCESS_URL}?booking=${bookingId}`);
    } else {
      return res.redirect(`${process.env.CLIENT_FAIL_URL}?booking=${bookingId}`);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('Payment verification error');
  }
}
