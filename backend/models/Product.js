import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fabric: { type: String, required: true },
  marketPrice: { type: Number },
  sellingPrice: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  quantity: { type: Number, default: 1 },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  colorVariants: [{
    name: String,
    hex: String,
    images: [String]
  }],
  category: { type: String, default: 'All' }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
