const express = require('express');
const router = express.Router();
const { 
  getAllFacilities, 
  getActiveFacilities,
  getFacilitiesByCategory,
  getFacility, 
  createFacility, 
  updateFacility, 
  deleteFacility,
  toggleActiveStatus,
  getFacilityCategories,
  getFacilityStats
} = require('../controllers/facilityController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/', getAllFacilities);
router.get('/active', getActiveFacilities);
router.get('/categories/list', getFacilityCategories);
router.get('/category/:category', getFacilitiesByCategory);
router.get('/stats', getFacilityStats);
router.get('/:id', getFacility);

// Protected routes (admin only)
router.post('/', authMiddleware, createFacility);
router.put('/:id', authMiddleware, updateFacility);
router.delete('/:id', authMiddleware, deleteFacility);
router.patch('/:id/toggle-active', authMiddleware, toggleActiveStatus);

module.exports = router;