import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true }, // URL er jonno: mens-polo
  parent: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    default: null // Null thakle eta Main Category (jemon Men), na hole Sub Category
  },
  image: { type: String },
  
  // ================= NEW FIELD: For Custom Ordering =================
  sortOrder: { 
    type: Number, 
    default: 0 // ডিফল্ট 0। অ্যাডমিন চাইলে 1, 2, 3 দিয়ে পজিশন সেট করতে পারবে।
  }
  // ====================================================================

}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
export default Category;