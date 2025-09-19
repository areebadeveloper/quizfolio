const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const emailController = require('../controllers/newEmailController');

// Verify email service connection (public endpoint for testing)
router.get('/verify', emailController.verifyEmailService);

// Test email endpoint (protected)
router.post('/test', auth, emailController.testEmail);

// Send custom email to multiple recipients (protected)
router.post('/custom', auth, emailController.sendCustomEmail);

// Send email to users by IDs (protected)
router.post('/users', auth, emailController.sendEmailToUsers);

// Send welcome email to new user (protected)
router.post('/welcome', auth, emailController.sendWelcomeEmail);

// Send quiz notification to students (protected)
router.post('/quiz-notification', auth, emailController.sendQuizNotification);

module.exports = router; 