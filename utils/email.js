import { createTransport } from 'nodemailer';

const transporter = createTransport({
  service: 'gmail', // hoặc SMTP khác
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendBookingConfirmation(userEmail, bookingInfo) {
  const mailOptions = {
    from: '"SanBai Booking" <no-reply@sanbai.vn>',
    to: userEmail,
    subject: 'Xác nhận thanh toán đặt sân thành công',
    html: `
      <h3>Chào bạn,</h3>
      <p>Bạn đã thanh toán thành công cho sân <strong>${bookingInfo.field.name}</strong> vào lúc <strong>${bookingInfo.date} - ${bookingInfo.timeSlot}</strong>.</p>
      <p>Chúc bạn có một trải nghiệm vui vẻ!</p>
    `
  };

  await transporter.sendMail(mailOptions);
}
