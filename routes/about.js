const express = require('express');
const router = express.Router();
const { getAllAbout, getAbout, createAbout, updateAbout, deleteAbout } = require('../controllers/aboutController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/', getAllAbout);
router.get('/:id', getAbout);

// Protected routes
router.post('/', authMiddleware, createAbout);
router.put('/:id', authMiddleware, updateAbout);
router.delete('/:id', authMiddleware, deleteAbout);

module.exports = router;
