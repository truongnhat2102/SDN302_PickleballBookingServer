import { Router } from 'express';
const router = Router();
import { createField, updateField, getMyFields, getBookings, updateBookingStatus, searchFields, getFieldById } from '../controllers/fieldController.js';
import { protect, managerOnly } from '../middlewares/auth.js';

router.post('/', protect, managerOnly, createField);
router.put('/:id', protect, managerOnly, updateField);
router.get('/my-fields', protect, managerOnly, getMyFields);
router.get('/bookings', protect, managerOnly, getBookings);
router.put('/booking/:id', protect, managerOnly, updateBookingStatus);
router.get('/search', searchFields);
router.get('/:id', getFieldById);

export default router;
