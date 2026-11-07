// routes/bannerRoutes.js
import express from 'express';
import { createBanner, getBanners, deleteBanner } from '../controllers/bannerController.js';
// আপনার যদি admin মিডলওয়্যার থাকে তবে সেটি ইমপোর্ট করবেন, যেমন: import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// পাবলিক রাউট (ওয়েবসাইটে দেখানোর জন্য)
router.get('/', getBanners);

// অ্যাডমিন রাউটস (পোস্ট এবং ডিলিট করার জন্য)
// নোট: প্রোডাকশনে যাওয়ার আগে এখানে protect এবং admin মিডলওয়্যার যুক্ত করে দেবেন
router.post('/', createBanner);
router.delete('/:id', deleteBanner);

export default router;