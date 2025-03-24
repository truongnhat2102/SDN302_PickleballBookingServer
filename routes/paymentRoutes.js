import { Router } from 'express';
const router = Router();
import { getMyPayments } from '../controllers/paymentController.js';
import { protect } from '../middlewares/auth.js';

router.get('/my', protect, getMyPayments);

export default router;
