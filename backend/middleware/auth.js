const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Check for token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route',
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not found',
            });
        }

        next();
    } catch (error) {
        // Log detailed error information
        console.error('====== AUTH MIDDLEWARE ERROR ======');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Token (first 20 chars):', token?.substring(0, 20));
        console.error('JWT_SECRET exists:', !!process.env.JWT_SECRET);
        console.error('====================================');

        return res.status(401).json({
            success: false,
            message: 'Not authorized, token failed',
        });
    }
};

// Optional auth - tries to get user but doesn't fail if no token
const optionalAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
        } catch (error) {
            // Token invalid, continue without user
            req.user = null;
        }
    }

    next();
};

module.exports = { protect, optionalAuth };




