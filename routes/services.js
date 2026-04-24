const express = require('express');
const router = express.Router();
const { 
  getAllServices, 
  getAllServicesAdmin,
  getService, 
  createService, 
  updateService, 
  deleteService 
} = require('../controllers/serviceController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/', getAllServices);

// Admin routes (protected) - Must come before /:id route
router.get('/admin/all', authMiddleware, getAllServicesAdmin);
router.post('/', authMiddleware, createService);
router.put('/:id', authMiddleware, updateService);
router.delete('/:id', authMiddleware, deleteService);

// Single service route - Must come after admin routes
router.get('/:id', getService);

module.exports = router;