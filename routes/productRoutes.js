import express from 'express';
// এখানে নতুন ৩টি ফাংশন ইম্পোর্ট করা হয়েছে:
import { 
  createProduct, getProducts, getSidebarFilters, 
  getProductById, updateProduct, deleteProduct 
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/filters', getSidebarFilters); 

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

// 👇 এই নতুন ব্লকটি যুক্ত করুন (ID দিয়ে Get, Put এবং Delete করার জন্য)
router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;