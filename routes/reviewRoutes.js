import { Router } from 'express';
const router = Router();
import { createReview, getReviewsForField } from '../controllers/reviewController.js';
import { protect } from '../middlewares/auth.js';

router.post('/', protect, createReview);
router.get('/field/:fieldId', getReviewsForField);

export default router;
