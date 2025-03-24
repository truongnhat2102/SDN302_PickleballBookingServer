import { createHmac } from 'crypto';
import moment from 'moment';

export function createPaymentUrl(req, res) {
  const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  const tmnCode = process.env.VNP_TMNCODE;
  const secretKey = process.env.VNP_HASHSECRET;
  const vnpUrl = process.env.VNP_URL;
  const returnUrl = process.env.VNP_RETURNURL;

  const date = new Date();
  const createDate = moment(date).format('YYYYMMDDHHmmss');
  const orderId = moment(date).format('HHmmss');
  const amount = req.body.amount;

  let vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderId,
    vnp_OrderInfo: 'Thanh toan don hang',
    vnp_OrderType: 'other',
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  vnp_Params = sortObject(vnp_Params);
  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  vnp_Params['vnp_SecureHash'] = signed;
  const paymentUrl = `${vnpUrl}?${querystring.stringify(vnp_Params, { encode: false })}`;
  res.json({ paymentUrl });
}

function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (let key of keys) sorted[key] = obj[key];
  return sorted;
}
