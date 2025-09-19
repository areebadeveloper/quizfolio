const express = require('express');
const router = express.Router();
const realEmailController = require('../controllers/realEmailController');

// Public routes for testing
router.get('/status', realEmailController.getStatus);
router.post('/test', realEmailController.sendTestEmail);

// Email sending routes (no auth required for demo purposes)
router.post('/welcome', realEmailController.sendWelcomeEmail);
router.post('/notification', realEmailController.sendNotification);
router.post('/custom', realEmailController.sendCustomEmail);

module.exports = router; 