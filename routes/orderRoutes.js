import express from 'express';
import { 
  addOrderItems, 
  getMyOrders, 
  getOrders, 
  updateOrderStatus 
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET request e shob order pabe (shudhu admin), POST e order toiri hobe
router.route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);

router.route('/myorders').get(protect, getMyOrders);

// Order status update korar route (shudhu admin parbe)
router.route('/:id/status').put(protect, admin, updateOrderStatus);

export default router;