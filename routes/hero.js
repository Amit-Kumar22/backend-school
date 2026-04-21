const express = require('express');
const router = express.Router();
const { getAllHero, getHero, createHero, updateHero, deleteHero } = require('../controllers/heroController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/', getAllHero);
router.get('/:id', getHero);

// Protected routes
router.post('/', authMiddleware, createHero);
router.put('/:id', authMiddleware, updateHero);
router.delete('/:id', authMiddleware, deleteHero);

module.exports = router;
