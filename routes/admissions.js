const express = require('express');
const router = express.Router();
const { getAllAdmissions, getAdmission, createAdmission, updateAdmission, deleteAdmission } = require('../controllers/admissionController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/', getAllAdmissions);
router.get('/:id', getAdmission);

// Protected routes
router.post('/', authMiddleware, createAdmission);
router.put('/:id', authMiddleware, updateAdmission);
router.delete('/:id', authMiddleware, deleteAdmission);

module.exports = router;
