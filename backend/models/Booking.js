import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  customerEmail: { type: String, required: true },
  mobile: { type: String },
  sareeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  sareeName: { type: String },
  qty: { type: Number, required: true },
  amount: { type: Number, required: true },
  paymentType: { type: String, enum: ['cod', 'online'], default: 'cod' },
  paymentDetails: { type: String },
  status: { type: String, enum: ['Pending', 'Order confirmed', 'Out for delivery', 'Delivered', 'Cancelled'], default: 'Pending' },
  address: { type: String, default: '' },
  date: { type: String }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
