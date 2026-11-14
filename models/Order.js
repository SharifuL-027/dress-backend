import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: false, 
    ref: 'User',
    default: null 
  },
  
  orderItems: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      image: { type: String },
      price: { type: Number, required: true },
      size: { type: String, required: true },
      color: { type: String, required: true },
      product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
    }
  ],

  shippingAddress: {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    notes: { type: String, default: "" },
  },

  paymentMethod: { type: String, required: true, default: 'Cash on Delivery' },
  
  itemsPrice: { type: Number, required: true, default: 0.0 },
  shippingPrice: { type: Number, required: true, default: 0.0 },
  totalPrice: { type: Number, required: true, default: 0.0 },
  
  isPaid: { type: Boolean, required: true, default: false },
  paidAt: { type: Date },
  
  status: { 
    type: String, 
    required: true, 
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Pending' 
  },
  
  isDelivered: { type: Boolean, required: true, default: false },
  deliveredAt: { type: Date },

}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;