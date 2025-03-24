import dotenv from 'dotenv';
dotenv.config();

import express, { json } from 'express';
import connectDB from './config/db.js';
import passport from 'passport';
import './config/passport.js';
import session from 'express-session';
import cors from 'cors';
import { autoCancelUnpaidBookings } from './utils/autoCancelJob.js';

// import các route dưới dạng ESM
import authRoutes from './routes/authRoutes.js';
import vnpayRoutes from './routes/vnpayRoutes.js';
import fieldRoutes from './routes/fieldRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import rankingRoutes from './routes/userRankingRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

// Chạy job tự động mỗi 5 phút
setInterval(autoCancelUnpaidBookings, 5 * 60000);

const app = express();
connectDB();
app.use(cors());
app.use(json());

app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Gắn route
app.use('/api/auth', authRoutes);
app.use('/api/vnpay', vnpayRoutes);
app.use('/api/fields', fieldRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/user-rankings', rankingRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/payments', paymentRoutes);

// Khởi chạy server
const PORT = process.env.PORT || 5001;  
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
