import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema({
  area: { type: String, required: true },
  cost: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Delivery', deliverySchema);