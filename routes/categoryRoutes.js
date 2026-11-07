import express from 'express';
import { createCategory, getCategories, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET: Shobai dekhte parbe (Mega Menu er jonno)
// POST: Shudhu Admin toiri korte parbe
router.route('/').get(getCategories).post(protect, admin, createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;