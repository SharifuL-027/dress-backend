import express from 'express';
import PromoCode from '../models/PromoCode.js';

const router = express.Router();

// GET: সব প্রোমো কোড দেখার জন্য (Admin)
router.get('/', async (req, res) => {
  try {
    const promos = await PromoCode.find();
    res.status(200).json(promos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching promos!" });
  }
});

// POST: নতুন প্রোমো কোড তৈরি করার জন্য (Admin)
router.post('/', async (req, res) => {
  try {
    const newPromo = new PromoCode(req.body);
    const savedPromo = await newPromo.save();
    res.status(201).json(savedPromo);
  } catch (error) {
    res.status(500).json({ message: "Error saving promo code!" });
  }
});

// DELETE: প্রোমো কোড ডিলিট করার জন্য (Admin)
router.delete('/:id', async (req, res) => {
  try {
    await PromoCode.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Promo code deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting promo!" });
  }
});

// POST: প্রোমো কোড ভ্যালিডেট করার জন্য (Checkout Page)
router.post('/validate', async (req, res) => {
  const { code } = req.body;
  try {
    const promo = await PromoCode.findOne({ code: code.toUpperCase(), isActive: true });
    if (!promo) return res.status(404).json({ message: "Invalid promo code." });
    if (new Date() > promo.expiryDate) return res.status(400).json({ message: "Promo code expired." });
    if (promo.usedCount >= promo.usageLimit) return res.status(400).json({ message: "Usage limit reached." });

    res.status(200).json({
      code: promo.code,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      message: "Promo code applied successfully!"
    });
  } catch (error) {
    res.status(500).json({ message: "Server error!" });
  }
});

export default router;