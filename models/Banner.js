// models/Banner.js
import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  image: {
    url: { type: String, required: true },
    public_id: { type: String, required: true }
  },
  type: { 
    type: String, 
    enum: ['Hero', 'Category', 'Promo'], // ৩ ধরণের ব্যানার রাখছি
    required: true 
  },
  // যদি ব্যানারটি 'Category' টাইপের হয়, তবে কোন ক্যাটাগরির ব্যানার সেটি ট্র্যাক করতে:
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category',
    default: null
  },
  // ব্যানারে ক্লিক করলে কোনো লিংকে যাবে কি না (Optional)
  link: { 
    type: String,
    default: ''
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;