import multer from 'multer';

// Server-e file save na kore direct RAM (memory) theke Cloudinary-te pathanor setup
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

export default upload;