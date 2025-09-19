const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { deleteUser } = require('../controllers/AuthController');
const { updateUser } = require('../controllers/AuthController');

// Middleware to handle validation results
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
    '/',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
        check('userType', 'User type is required').isIn(['student', 'teacher']),
    ],
    validate,
    userController.registerUser
);

// @route    GET api/users/profile
// @desc     Get user profile
// @access   Private
router.get('/profile', auth, userController.getUserProfile);

// @route    GET api/users/all
// @desc     Get all users
// @access   Private (requires auth middleware)
router.get('/all', auth, userController.getAllUsers);


// @route    DELETE api/users/:id
// @desc     Delete a user by ID
// @access   Private (requires auth and teacher/admin role)
router.delete('/:id', auth, deleteUser);

// @route    PUT /api/users/:id
// @desc     Update a user by ID
// @access   Private
router.put('/:id', auth, updateUser);


// @route    PUT /api/users/:id
// @desc     Update a user by ID
// @access   Private
router.put('/:id', auth, updateUser);


module.exports = router;
