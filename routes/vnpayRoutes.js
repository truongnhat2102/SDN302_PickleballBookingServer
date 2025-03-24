import { Router } from 'express';
const router = Router();
import { createPaymentUrl, paymentReturn } from '../controllers/vnpayController.js';
import { protect } from '../middlewares/auth.js';

router.post('/create-payment', protect, createPaymentUrl);
router.get('/return', paymentReturn);

export default router;
