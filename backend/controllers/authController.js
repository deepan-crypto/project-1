const User = require('../models/User');
const { sendPasswordResetEmail } = require('../utils/emailService');

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res, next) => {
    try {
        const { fullName, email, username, password, dateOfBirth, gender } = req.body;

        // Validate required fields
        if (!fullName || !email || !username || !password) {
            res.status(400);
            throw new Error('Please provide all required fields');
        }

        // Validate fullName (no numbers allowed)
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(fullName.trim())) {
            res.status(400);
            throw new Error('Name can only contain letters and spaces, no numbers allowed');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400);
            throw new Error('Please provide a valid email address');
        }

        // Validate username length
        if (username.length < 3) {
            res.status(400);
            throw new Error('Username must be at least 3 characters long');
        }

        // Validate password strength (minimum 6 characters)
        if (password.length < 6) {
            res.status(400);
            throw new Error('Password must be at least 6 characters long');
        }

        // Validate date of birth if provided
        if (dateOfBirth) {
            // Check if dateOfBirth is a valid date
            const date = new Date(dateOfBirth);
            if (isNaN(date.getTime())) {
                res.status(400);
                throw new Error('Please provide a valid date of birth');
            }

            // Optional: Check if user is at least 13 years old
            const thirteenYearsAgo = new Date();
            thirteenYearsAgo.setFullYear(thirteenYearsAgo.getFullYear() - 13);
            if (date > thirteenYearsAgo) {
                res.status(400);
                throw new Error('You must be at least 13 years old to register');
            }
        }

        // Check for existing email
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            res.status(400);
            throw new Error('This email is already registered. Please use a different email or login.');
        }

        // Check for existing username
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            res.status(400);
            throw new Error('This username is already taken. Please choose a different username.');
        }

        // Create user
        const user = await User.create({
            fullName,
            email,
            username,
            password,
            dateOfBirth,
            gender,
        });

        // Generate token
        const token = user.generateAuthToken();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                username: user.username,
                profilePicture: user.profilePicture,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Validate fields
        if (!username || !password) {
            res.status(400);
            throw new Error('Please provide username and password');
        }

        // Validate minimum lengths
        if (username.trim().length === 0 || password.trim().length === 0) {
            res.status(400);
            throw new Error('Username and password cannot be empty');
        }

        // Find user and include password
        const user = await User.findOne({ username }).select('+password');

        if (!user) {
            res.status(401);
            throw new Error('No account found with this username. Please check your username or sign up.');
        }

        // Check password
        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            res.status(401);
            throw new Error('Incorrect password. Please try again.');
        }

        // Generate token
        const token = user.generateAuthToken();

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                username: user.username,
                profilePicture: user.profilePicture,
                bio: user.bio,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Forgot password - send reset link
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            res.status(400);
            throw new Error('Please provide email address');
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            res.status(404);
            throw new Error('No user found with this email');
        }

        // Generate reset token
        const resetToken = user.generatePasswordResetToken();
        await user.save();

        // Send email
        const emailResult = await sendPasswordResetEmail(email, resetToken);

        if (!emailResult.success) {
            res.status(500);
            throw new Error('Email could not be sent');
        }

        res.status(200).json({
            success: true,
            message: 'Password reset link sent to email',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            res.status(400);
            throw new Error('Please provide token and new password');
        }

        // Find user with valid token
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            res.status(400);
            throw new Error('Invalid or expired token');
        }

        // Update password
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successful',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Google OAuth - Initiate
// @route   GET /api/auth/google
// @access  Public
const googleAuth = (req, res, next) => {
    // This will be handled by passport middleware in routes
    // Just a placeholder for documentation
};

// @desc    Google OAuth - Callback
// @route   GET/POST /api/auth/google/callback
// @access  Public
const googleCallback = async (req, res, next) => {
    try {
        // Handle POST request from mobile (direct code exchange)
        if (req.method === 'POST') {
            // For mobile flow, return JSON directly
            // User is attached by passport or needs to be fetched
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Google authentication failed',
                });
            }

            const user = req.user;
            const token = user.generateAuthToken();

            return res.status(200).json({
                success: true,
                message: 'Google authentication successful',
                token,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    username: user.username,
                    profilePicture: user.profilePicture,
                    bio: user.bio,
                },
            });
        }

        // Handle GET request (web browser flow)
        // User is attached to req.user by passport
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Google authentication failed',
            });
        }

        const user = req.user;

        // Generate JWT token
        const token = user.generateAuthToken();

        // For mobile app, redirect to a custom URL scheme with the token
        // The frontend will handle this URL and extract the token
        const redirectUrl = `myapp://auth/callback?token=${token}&userId=${user._id}`;

        // Alternatively, return JSON if called from API
        if (req.query.mobile === 'true' || req.body.mobile === 'true') {
            return res.status(200).json({
                success: true,
                message: 'Google authentication successful',
                token,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    username: user.username,
                    profilePicture: user.profilePicture,
                    bio: user.bio,
                },
            });
        }

        // Redirect to mobile app with token
        res.redirect(redirectUrl);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    signup,
    login,
    forgotPassword,
    resetPassword,
    googleAuth,
    googleCallback,
};
