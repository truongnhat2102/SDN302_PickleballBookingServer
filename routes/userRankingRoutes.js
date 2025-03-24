import { Router } from 'express';
const router = Router();
import { getUserRankings } from '../controllers/userRankingController.js';

// Có thể mở cho admin hoặc public tuỳ bạn
router.get('/', getUserRankings);

export default router;
