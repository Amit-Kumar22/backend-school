const express = require('express');
const router = express.Router();
const { getAllContacts, getContact, createContact, updateContact, deleteContact } = require('../controllers/contactController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/', getAllContacts);
router.get('/:id', getContact);

// Protected routes
router.post('/', authMiddleware, createContact);
router.put('/:id', authMiddleware, updateContact);
router.delete('/:id', authMiddleware, deleteContact);

module.exports = router;
