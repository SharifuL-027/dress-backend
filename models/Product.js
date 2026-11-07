import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  sku: { type: String, required: true }, // Product Code
  
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  gender: { type: String, default: 'Unisex' },
  brand: { type: String },
  
  // Pricing
  regularPrice: { type: Number, required: true },
  discountPrice: { type: Number },
  
  // =====================================
  // 🚀 ADVANCED STOCK & VARIANTS
  // =====================================
  // মোট স্টক (সবগুলো ভেরিয়েন্টের স্টকের যোগফল)
  totalStock: { type: Number, required: true, default: 0 },
  
  // কালার এবং সাইজ অনুযায়ী আলাদা আলাদা স্টক ট্র্যাকিং
  variants: [
    {
      color: { type: String, required: true },
      size: { type: String, required: true },
      stock: { type: Number, required: true, default: 0 }
    }
  ],
  
  // ওয়েবসাইটে ফিল্টারিংয়ের জন্য শুধু ইউনিক সাইজ ও কালারের নামগুলো
  sizes: [{ type: String }],
  colors: [{ type: String }],
  // =====================================
  
  // Specifications
  fabric: { type: String },
  gsm: { type: String },
  fitType: { type: String },
  sleeveType: { type: String },
  pattern: { type: String },
  origin: { type: String, default: 'Bangladesh' },
  
  // Description & Policies
  description: { type: String },
  keyFeatures: { type: String },
  sizeChart: { type: String },
  washingInstructions: { type: String },
  deliveryInfo: { type: String },
  returnPolicy: { type: String },
  
  // Media Files
  images: [
    {
      url: { type: String, required: true },
      public_id: { type: String }
    }
  ],
  video: {
    url: { type: String },
    public_id: { type: String }
  },
  
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;