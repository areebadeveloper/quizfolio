const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const jwtSecret = process.env.JWT_SECRET;

// Check if JWT_SECRET is set
if (!jwtSecret) {
    console.error('JWT Secret not found in environment variables');
    throw new Error('JWT Secret is missing. Please set JWT_SECRET environment variable.');
}

// Register a new user
exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, userType, studentId, studentClass, teacherId } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password,
            userType,
            studentId: userType === 'student' ? studentId : undefined,
            studentClass: userType === 'student' ? studentClass : undefined,
            teacherId: userType === 'teacher' ? teacherId : undefined,
        });

        // The password will be hashed in the pre-save hook defined in the User model
        // No need to hash it here as it's already handled in the model

        await user.save();

        const payload = {
            user: {
                id: user.id,
                userType: user.userType,
            },
        };

        jwt.sign(payload, jwtSecret, { expiresIn: '5h' }, (err, token) => {
            if (err) {
                console.error('JWT Sign Error:', err.message);
                return res.status(500).json({ msg: 'Server error during token generation' });
            }
            res.json({ 
                token, 
                userId: user.id, 
                userType: user.userType,
                name: user.name
            });
        });
    } catch (err) {
        console.error('Registration Error:', err.message);
        res.status(500).json({ msg: 'Server error during registration', error: err.message });
    }
};

// Login user and return token
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials - email not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ 
                msg: 'Invalid credentials - password does not match',
                // For debugging only - remove in production
                debug: {
                    providedPassword: password.substring(0, 3) + '...',
                    hashedPasswordLength: user.password.length
                }
            });
        }

        const payload = {
            user: {
                id: user.id,
                userType: user.userType,
            },
        };

        jwt.sign(payload, jwtSecret, { expiresIn: '5h' }, (err, token) => {
            if (err) {
                console.error('JWT Sign Error:', err.message);
                return res.status(500).json({ msg: 'Server error during token generation' });
            }
            res.json({ 
                token, 
                userId: user.id, 
                userType: user.userType,
                name: user.name
            });
        });
    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ msg: 'Server error during login', error: err.message });
    }
};


// Get user details based on token
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Delete a user by ID
// Delete a user by ID
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        // Check if the user exists
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Delete the user using findByIdAndDelete
        await User.findByIdAndDelete(req.params.id);

        res.json({ msg: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err.message);
        res.status(500).send('Server Error');
    }
};


// controllers/authController.js

// Update a user by ID
exports.updateUser = async (req, res) => {
    try {
        const { name, email, userType, studentId, studentClass, teacherId } = req.body;

        // Find the user by ID and update with new data
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, userType, studentId, studentClass, teacherId },
            { new: true, runValidators: true }
        );

        // Check if the user exists
        if (!updatedUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json({ msg: 'User updated successfully', user: updatedUser });
    } catch (err) {
        console.error('Error updating user:', err.message);
        res.status(500).send('Server Error');
    }
};



