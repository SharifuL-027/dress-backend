import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import cloudinary from '../utils/cloudinary.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/upload
// @access  Private/Admin
// 'media' namer parameter diye file asbe
router.post('/', protect, admin, upload.single('media'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    // Cloudinary upload stream (Auto detection for image & video)
    const stream = cloudinary.uploader.upload_stream(
      { 
        folder: 'dresstown_products',
        resource_type: 'auto' 
      }, 
      (error, result) => {
        if (error) return res.status(500).json({ message: error.message });
        
        res.status(200).json({
          message: 'Media uploaded successfully',
          url: result.secure_url,
          publicId: result.public_id,
          format: result.resource_type // Result-e dekhabe eta 'image' naki 'video'
        });
      }
    );

    // Buffer data stream-e pass kora
    stream.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;