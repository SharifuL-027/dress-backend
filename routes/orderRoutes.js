import express from 'express';
import { 
  addOrderItems, 
  getMyOrders, 
  getOrders, 
  getOrderById,
  updateOrderStatus 
} from '../controllers/orderController.js';
import { protect, admin, optionalProtect } from '../middleware/authMiddleware.js'; // optionalProtect import kora holo

const router = express.Router();

// POST e optionalProtect dewa hoyeche jate guest ebong logged-in user ubhoyi order korte pare
// GET request e shob order pabe (shudhu admin)
router.route('/')
  .post(optionalProtect, addOrderItems)
  .get(protect, admin, getOrders);

router.route('/myorders').get(protect, getMyOrders);

// Order status update korar route (shudhu admin parbe)
router.route('/:id/status').put(protect, admin, updateOrderStatus);
router.route('/:id').get(getOrderById);
export default router;