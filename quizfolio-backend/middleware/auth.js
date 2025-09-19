const jwt = require('jsonwebtoken');
// Use environment variable for JWT secret
const jwtSecret = process.env.JWT_SECRET;

// Check if JWT_SECRET is set
if (!jwtSecret) {
    console.error('JWT Secret not found in environment variables');
    throw new Error('JWT Secret is missing. Please set JWT_SECRET environment variable.');
}

module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, jwtSecret);

        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
