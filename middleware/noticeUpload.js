const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create notices upload directory if it doesn't exist
const noticeUploadDir = 'uploads/notices';
if (!fs.existsSync(noticeUploadDir)) {
  fs.mkdirSync(noticeUploadDir, { recursive: true });
}

// Configure storage for notices
const noticeStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, noticeUploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'notice-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for notices (images and PDFs)
const noticeFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /^(image\/(jpeg|jpg|png|gif|webp)|application\/pdf)$/.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF, WEBP) and PDF files are allowed!'));
  }
};

// Notice upload configuration
const noticeUpload = multer({
  storage: noticeStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for notices
  },
  fileFilter: noticeFileFilter
});

module.exports = noticeUpload;