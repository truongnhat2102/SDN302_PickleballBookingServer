import { Router } from 'express';
const router = Router();
import { createBooking, getMyBookings, cancelBooking ,getUnavailableSlots} from '../controllers/bookingController.js';
import { protect } from '../middlewares/auth.js';

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.put('/cancel/:id', protect, cancelBooking);
router.get('/availability', getUnavailableSlots);


export default router;