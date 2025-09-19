const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  console.error('JWT Secret not found in environment variables');
  throw new Error('JWT Secret is missing. Please set JWT_SECRET environment variable.');
}

// Register user
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

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id,
                userType: user.userType,
            },
        };

        jwt.sign(
            payload,
            jwtSecret,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({ msg: 'Server error' });
                }
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                userType: user.userType,
            },
        };

        jwt.sign(
            payload,
            jwtSecret,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({ msg: 'Server error' });
                }
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get user details
exports.getUserProfile = async (req, res) => {
    try {
        // Fetch user profile based on req.user.id (available from auth middleware)
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};



// Fetch all users
exports.getAllUsers = async (req, res) => {
    try {
        // Fetch all users, excluding the password field
        const users = await User.find().select('-password');
        
        // Check if there are no users found
        if (!users || users.length === 0) {
            return res.status(404).json({ msg: 'No users found' });
        }

        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// Delete a user by ID
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Delete the user
        await User.findByIdAndDelete(req.params.id);

        res.json({ msg: 'User deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};




