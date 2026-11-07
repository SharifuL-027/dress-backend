import express from 'express';
import Delivery from '../models/Delivery.js'; 

const router = express.Router();

// GET: সব ডেলিভারি অপশন দেখার জন্য
router.get('/', async (req, res) => {
  try {
    const deliveryOptions = await Delivery.find({ isActive: true });
    res.status(200).json(deliveryOptions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching deliveries!" });
  }
});

// POST: নতুন ডেলিভারি অপশন তৈরি করার জন্য (Admin)
router.post('/', async (req, res) => {
  try {
    const newDelivery = new Delivery({
      area: req.body.area,
      cost: req.body.cost,
      isActive: true
    });
    const savedDelivery = await newDelivery.save();
    res.status(201).json(savedDelivery);
  } catch (error) {
    res.status(500).json({ message: "Error saving delivery option!" });
  }
});

// DELETE: ডেলিভারি অপশন ডিলিট করার জন্য (Admin)
router.delete('/:id', async (req, res) => {
  try {
    await Delivery.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Delivery option deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting option!" });
  }
});

export default router;