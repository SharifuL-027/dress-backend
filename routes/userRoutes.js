import express from 'express';
import { 
  getUserProfile, 
  getUsers, 
  deleteUser, 
  changePassword, 
  updateProfile 
} from '../controllers/userController.js'; // নতুন ২টি ফাংশন ইমপোর্ট করা হয়েছে
import { getDashboardStats } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// ----------------------------------------------------
// Public / User Routes (লগ-ইন করা ইউজারদের জন্য)
// ----------------------------------------------------

// ইউজারের প্রোফাইল দেখা এবং আপডেট করার রাউট (একই URL, কিন্তু Method ভিন্ন)
router.route('/profile')
  .get(protect, getUserProfile)      // GET রিকোয়েস্ট দিয়ে ডাটা আনবে
  .put(protect, updateProfile);      // PUT রিকোয়েস্ট দিয়ে ডাটা আপডেট করবে (Edit Profile)

// ইউজারের পাসওয়ার্ড চেঞ্জ করার রাউট
router.put('/change-password', protect, changePassword);


// ----------------------------------------------------
// Admin Routes (protect এবং admin দুটোই লাগবে)
// ----------------------------------------------------

// ড্যাশবোর্ডের স্ট্যাটস দেখার রাউট
router.get('/dashboard-stats', protect, admin, getDashboardStats);

// অ্যাডমিন প্যানেলের Customer পেজের জন্য সব ইউজার দেখা এবং ডিলিট করার রাউট
router.get('/', protect, admin, getUsers);
router.delete('/:id', protect, admin, deleteUser);

export default router;