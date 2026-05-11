require('dotenv').config();

// Validate required environment variables
const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_REGION',
    'SES_FROM_EMAIL'
];

const missingVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars.join(', '));
    console.error('Please check your .env file and ensure all required variables are set.');
    process.exit(1);
}

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const { initSES } = require('./config/sesConfig');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const pollRoutes = require('./routes/polls');
const postRoutes = require('./routes/posts');
const notificationRoutes = require('./routes/notifications');
const emailRoutes = require('./routes/email');

// Initialize express app
const app = express();

// Create HTTP server for Socket.IO
const server = http.createServer(app);

/* =======================================================================
   CORS CONFIGURATION (Fixed for Admin Panel + Mobile App)
   =======================================================================
*/
const corsOrigin = process.env.FRONTEND_URL;
const adminPanelUrl = process.env.ADMIN_PANEL_URL;

// FIX 1: Explicitly include all needed origins here
const allowedOrigins = [
    corsOrigin,                                  // From .env (Mobile App / Production)
    adminPanelUrl,                               // From .env (Admin Panel)
    'http://localhost:5173',                     // Vite Frontend (Local Admin Panel)
    'http://localhost:8081',                     // React Native (Local App)
    'https://project-1-admin-panel.vercel.app'   // Hardcoded Admin Panel (Safety)
].filter(Boolean); // removes null/undefined

console.log('=== CORS Configuration ===');
console.log('Allowed Origins:', allowedOrigins);
console.log('========================');

// Initialize Socket.IO with secure CORS
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    },
});

// Store io instance globally for use in controllers
global.io = io;

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // User joins their personal room for notifications
    socket.on('join', (userId) => {
        try {
            // Validate userId before joining
            if (userId && typeof userId === 'string' && userId.match(/^[0-9a-fA-F]{24}$/)) {
                socket.join(userId);
                console.log(`User ${userId} joined their notification room`);
            } else {
                console.error('Invalid userId provided for socket join:', userId);
                socket.emit('error', { message: 'Invalid user ID' });
            }
        } catch (error) {
            console.error('Error joining socket room:', error);
            socket.emit('error', { message: 'Failed to join notification room' });
        }
    });

    // Handle socket errors
    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Connect to MongoDB
connectDB();

// Initialize AWS SES
initSES().catch(err => console.error('SES init error:', err.message));

if (!corsOrigin && process.env.NODE_ENV === 'production') {
    console.warn('WARNING: FRONTEND_URL environment variable is not set in production mode.');
}

// FIX 2: Express CORS Middleware with 'x-admin-token' allowed
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked request from origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

    // *** CRITICAL FIX FOR ADMIN LOGIN ***
    allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-token'],

    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 600, // Cache preflight for 10 minutes
}));

app.use(express.json({ limit: '10mb' })); // Limit request body size
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploaded images
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/email', emailRoutes);

// Health check route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Polling App API is running',
        version: '1.0.0',
        allowedOrigins: allowedOrigins
    });
});

// Deep link redirect for shared polls
// When someone clicks a shared poll link, this page opens the poll in the app
app.get('/poll/:pollId', async (req, res) => {
    const { pollId } = req.params;
    const deepLink = `myapp://poll/${pollId}`;

    // Try to fetch the poll question for a nicer preview
    let pollQuestion = 'Check out this poll on Thoughts!';
    try {
        const Poll = require('./models/Poll');
        const poll = await Poll.findById(pollId);
        if (poll) {
            pollQuestion = poll.question;
        }
    } catch (err) {
        // Ignore - use default question
    }

    res.send(`<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Thoughts - ${pollQuestion}</title>
    <meta property="og:title" content="Vote on Thoughts">
    <meta property="og:description" content="${pollQuestion}">
    <meta property="og:type" content="website">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        .card { background: white; border-radius: 16px; padding: 32px; max-width: 400px; width: 90%; text-align: center; box-shadow: 0 4px 24px rgba(0,0,0,0.1); }
        .logo { font-size: 28px; font-weight: 700; color: #458FD0; margin-bottom: 16px; }
        .question { font-size: 18px; color: #101720; margin-bottom: 24px; line-height: 1.5; }
        .btn { display: inline-block; background: #458FD0; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px; font-weight: 600; }
        .sub { margin-top: 16px; font-size: 13px; color: #687684; }
    </style>
</head>
<body>
    <div class="card">
        <div class="logo">Thoughts</div>
        <p class="question">${pollQuestion}</p>
        <a href="${deepLink}" class="btn">Open in App</a>
        <p class="sub">Opening Thoughts app...</p>
    </div>
    <script>
        // Try to open the app automatically
        window.location.href = "${deepLink}";
    </script>
</body>
</html>`);
});

// Deep link redirect for shared profiles
app.get('/profile/:username', (req, res) => {
    const { username } = req.params;
    const deepLink = `myapp://profile/${username}`;

    res.send(`<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Thoughts - @${username}</title>
    <meta property="og:title" content="@${username} on Thoughts">
    <meta property="og:description" content="Check out @${username}'s profile on Thoughts!">
    <meta property="og:type" content="profile">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        .card { background: white; border-radius: 16px; padding: 32px; max-width: 400px; width: 90%; text-align: center; box-shadow: 0 4px 24px rgba(0,0,0,0.1); }
        .logo { font-size: 28px; font-weight: 700; color: #458FD0; margin-bottom: 16px; }
        .question { font-size: 18px; color: #101720; margin-bottom: 24px; line-height: 1.5; }
        .btn { display: inline-block; background: #458FD0; color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px; font-weight: 600; }
        .sub { margin-top: 16px; font-size: 13px; color: #687684; }
    </style>
</head>
<body>
    <div class="card">
        <div class="logo">Thoughts</div>
        <p class="question">Check out @${username}'s profile</p>
        <a href="${deepLink}" class="btn">Open in App</a>
        <p class="sub">Opening Thoughts app...</p>
    </div>
    <script>
        window.location.href = "${deepLink}";
    </script>
</body>
</html>`);
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server (use 'server' instead of 'app' for Socket.IO)
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log('Socket.IO enabled for real-time notifications');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error(`Error: ${err.message}`);
    // process.exit(1); // Optional: prevents crash if DB connects slowly
});