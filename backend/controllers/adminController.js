import Booking from '../models/Booking.js';
import Product from '../models/Product.js';

export const getStats = async (req, res) => {
  try {
    const totalOrders = await Booking.countDocuments();
    const activeSarees = await Product.countDocuments({ status: 'Active' });
    
    const bookings = await Booking.find();
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);

    const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      totalOrders,
      totalRevenue,
      activeSarees,
      recentBookings
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
