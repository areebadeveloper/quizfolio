const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const authController = require('../controllers/AuthController');
const auth = require('../middleware/auth');

// Middleware to handle validation results
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// @route    POST api/auth/register
// @desc     Register user
// @access   Public
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

// @route    POST api/auth/login
// @desc     Authenticate user & get token
// @access   Public
router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    validate,
    authController.loginUser
);

// @route    GET api/auth
// @desc     Get user by token
// @access   Private
router.get('/', auth, authController.getUser);

module.exports = router;
