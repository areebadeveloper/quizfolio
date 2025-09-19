const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const authController = require('../controllers/AuthController');
const auth = require('../middleware/auth');
const User = require('../models/user');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

// Middleware to handle validation results
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Register Route
router.post(
    '/register',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
        check('userType', 'User type is required').not().isEmpty(),
    ],
    validate,
    authController.registerUser
);

// Login Route
router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    validate,
    authController.loginUser
);

// Get User Route
router.get('/user', auth, authController.getUser);

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
  
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'No account with that email found.' });
        }
  
        // Generate a reset token and set expiration
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpire = Date.now() + 3600000; // Token valid for 1 hour
  
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = resetTokenExpire;
        await user.save();
  
        // Configure nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
  
        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
  
        // Email content
        const mailOptions = {
            to: email,
            from: 'no-reply@yourdomain.com',
            subject: 'Password Reset Request',
            text: `You are receiving this email because you (or someone else) requested a password reset for your account. Click the link to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.\n`,
        };
  
        // Send email
        await transporter.sendMail(mailOptions);
        res.json({ msg: 'Password reset email sent successfully.' });
    } catch (error) {
        console.error('Error sending reset email:', error);
        res.status(500).json({ msg: 'Error sending password reset email.', error: error.message });
    }
});

// Reset Password Route
router.put('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
  
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ msg: 'Password must be at least 6 characters long' });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() },
        });
  
        if (!user) {
            return res.status(400).json({ msg: 'Invalid or expired token.' });
        }
  
        // Hash the new password - using bcryptjs
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
  
        // Clear reset token and expiration
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
  
        await user.save();
        res.json({ msg: 'Password has been reset successfully.' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ msg: 'Server error during password reset', error: error.message });
    }
});

module.exports = router;
