const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multiEmailController = require('../controllers/multiEmailController');

// Public routes (no authentication required)
router.get('/status', multiEmailController.getStatus);

// Protected routes (authentication required)
router.post('/test', auth, multiEmailController.sendTestEmail);
router.post('/welcome', auth, multiEmailController.sendWelcomeEmail);
router.post('/notification', auth, multiEmailController.sendNotification);
router.post('/users', auth, multiEmailController.sendEmailToUsers);
router.post('/custom', auth, multiEmailController.sendCustomEmail);

module.exports = router; 