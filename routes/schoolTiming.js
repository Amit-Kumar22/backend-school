const express = require('express');
const router = express.Router();
const { 
  getAllSchoolTimings, 
  getActiveSchoolTiming,
  getSchoolTiming, 
  createSchoolTiming, 
  updateSchoolTiming, 
  deleteSchoolTiming,
  toggleActiveStatus
} = require('../controllers/schoolTimingController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/', getAllSchoolTimings);
router.get('/active', getActiveSchoolTiming);
router.get('/:id', getSchoolTiming);

// Protected routes (admin only)
router.post('/', authMiddleware, createSchoolTiming);
router.put('/:id', authMiddleware, updateSchoolTiming);
router.delete('/:id', authMiddleware, deleteSchoolTiming);
router.patch('/:id/toggle-active', authMiddleware, toggleActiveStatus);

module.exports = router;