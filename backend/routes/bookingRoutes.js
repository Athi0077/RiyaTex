import express from 'express';
import { createBooking, getBookings, getUserBookings, updateBookingStatus, deleteBooking } from '../controllers/bookingController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/bookings', authMiddleware, createBooking);
router.get('/bookings', authMiddleware, adminMiddleware, getBookings);
router.get('/bookings/user/:email', authMiddleware, getUserBookings);
router.put('/bookings/:id', authMiddleware, adminMiddleware, updateBookingStatus);
router.delete('/bookings/:id', authMiddleware, adminMiddleware, deleteBooking);

export default router;
