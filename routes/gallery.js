const express = require('express');
const router = express.Router();
const {
  getAllGallery,
  getGalleryById,
  createGallery,
  updateGallery,
  deleteGallery,
  getCategories
} = require('../controllers/galleryController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/', getAllGallery);
router.get('/categories', getCategories);
router.get('/:id', getGalleryById);

// Protected routes
router.post('/', authMiddleware, createGallery);
router.put('/:id', authMiddleware, updateGallery);
router.delete('/:id', authMiddleware, deleteGallery);

module.exports = router;
