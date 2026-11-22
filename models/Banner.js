// models/Banner.js
import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    default: '' 
  },
  buttonText: { 
    type: String, 
    default: 'Explore Collection' 
  },
  image: {
    url: { type: String, required: true },
    public_id: { type: String, required: true }
  },
  type: { 
    type: String, 
    enum: ['Hero', 'Category', 'Promo'], 
    required: true 
  },
  
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category',
    default: null
  },
  
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