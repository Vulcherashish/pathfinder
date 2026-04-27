const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Upload = require('../models/Upload');
const { protect } = require('../middleware/auth');

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|pdf|doc|docx/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error('Only images, PDFs, and Word documents are allowed.'));
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter
});

// @desc    Upload a file
// @route   POST /api/uploads
router.post('/', protect, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });

    const record = await Upload.create({
      userId: req.user._id,
      filePath: req.file.path,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
    });

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully!',
      data: record
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user's uploaded files
// @route   GET /api/uploads
router.get('/', protect, async (req, res, next) => {
  try {
    const files = await Upload.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: files.length, data: files });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
