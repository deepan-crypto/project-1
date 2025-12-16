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

        // Find user and include password
        const user = await User.findOne({ username }).select('+password');

        if (!user) {
            res.status(401);
            throw new Error('Invalid credentials');
        }

        // Check password
        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            res.status(401);
            throw new Error('Invalid credentials');
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

module.exports = {
    signup,
    login,
    forgotPassword,
    resetPassword,
};
