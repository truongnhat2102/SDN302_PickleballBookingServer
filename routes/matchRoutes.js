import { Router } from 'express';
const router = Router();
import { createMatchRequest, findMatchRequests, joinMatchRequest } from '../controllers/matchController.js';
import { protect } from '../middlewares/auth.js';

router.post('/', protect, createMatchRequest);
router.get('/', protect, findMatchRequests);
router.put('/join/:id', protect, joinMatchRequest);

export default router;
