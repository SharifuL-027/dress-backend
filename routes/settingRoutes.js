import express from "express";
import SiteSetting from "../models/SiteSetting.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Get all site settings (Public)
// @route   GET /api/settings
router.get("/", async (req, res) => {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = await SiteSetting.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update site settings (Admin Only)
// @route   PUT /api/settings
router.put("/", protect, admin, async (req, res) => {
  try {
    let settings = await SiteSetting.findOne();

    if (!settings) {
      settings = new SiteSetting(req.body);
    } else {
      Object.assign(settings, req.body);
    }

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;