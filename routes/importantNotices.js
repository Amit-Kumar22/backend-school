const express = require('express');
const router = express.Router();
const { 
  getAllImportantNotices, 
  getActiveImportantNotices,
  getImportantNotice, 
  createImportantNotice, 
  updateImportantNotice, 
  deleteImportantNotice,
  toggleActiveStatus,
  getNoticeStats
} = require('../controllers/importantNoticeController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/', getAllImportantNotices);
router.get('/active', getActiveImportantNotices);
router.get('/stats', getNoticeStats);
router.get('/:id', getImportantNotice);

// Protected routes (admin only)
router.post('/', authMiddleware, createImportantNotice);
router.put('/:id', authMiddleware, updateImportantNotice);
router.delete('/:id', authMiddleware, deleteImportantNotice);
router.patch('/:id/toggle-active', authMiddleware, toggleActiveStatus);

module.exports = router;