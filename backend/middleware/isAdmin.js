const jwt = require('jsonwebtoken');

// Simple admin check middleware
// For now, we'll use a special admin email/token approach
// You can enhance this with a proper admin table later
const isAdmin = async (req, res, next) => {
    try {
        // Check for admin token in headers
        const adminToken = req.headers['x-admin-token'];

        if (!adminToken) {
            return res.status(401).json({
                success: false,
                message: 'Admin authentication required',
            });
        }

        // Verify admin token
        // For simplicity, checking against environment variable
        // In production, you'd want a proper admin authentication system
        const validAdminToken = process.env.ADMIN_SECRET_TOKEN;

        if (!validAdminToken) {
            console.error('ADMIN_SECRET_TOKEN not set in environment variables');
            return res.status(500).json({
                success: false,
                message: 'Admin authentication not configured',
            });
        }

        if (adminToken !== validAdminToken) {
            return res.status(403).json({
                success: false,
                message: 'Invalid admin credentials',
            });
        }

        // Admin authenticated
        next();
    } catch (error) {
        console.error('Admin auth error:', error);
        res.status(500).json({
            success: false,
            message: 'Admin authentication failed',
        });
    }
};

module.exports = isAdmin;
