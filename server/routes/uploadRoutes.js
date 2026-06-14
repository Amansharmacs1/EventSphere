const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect, authorize } = require('../middleware/authMiddleware');
const cloudinary = require('../config/cloudinary');

const router = express.Router();

// Setup Multer Memory Storage for Serverless Environments
const storage = multer.memoryStorage();

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only!'));
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// @desc    Upload an image
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, authorize('admin'), upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image uploaded' });
  }
  
  // Stream the buffer to Cloudinary
  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: 'event_banners' },
    (error, result) => {
      if (error) {
        console.error('Cloudinary Upload Error:', error);
        return res.status(500).json({ success: false, message: 'Image upload failed' });
      }
      
      // Return the secure URL provided by Cloudinary
      res.status(200).json({ success: true, url: result.secure_url });
    }
  );

  // End the stream with the buffer
  uploadStream.end(req.file.buffer);
});

module.exports = router;
