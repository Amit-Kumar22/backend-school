const express = require('express');
const router = express.Router();
const {
  getAllNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice
} = require('../controllers/noticeController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/', getAllNotices);
router.get('/:id', getNoticeById);

// Protected routes (Admin only)
router.post('/', authMiddleware, createNotice);
router.put('/:id', authMiddleware, updateNotice);
router.delete('/:id', authMiddleware, deleteNotice);

module.exports = router;