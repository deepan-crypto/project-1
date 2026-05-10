const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        index: true,
    },
    otp: {
        type: String,
        required: [true, 'OTP is required'],
    },
    purpose: {
        type: String,
        enum: ['email_verification', 'password_reset', 'login', 'general'],
        default: 'general',
    },
    attempts: {
        type: Number,
        default: 0,
        max: 5,
    },
    isUsed: {
        type: Boolean,
        default: false,
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 }, // TTL index — MongoDB auto-deletes expired docs
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

/**
 * Hash OTP before saving (so raw OTP is never stored in DB)
 */
otpSchema.pre('save', async function (next) {
    if (!this.isModified('otp')) return next();

    const salt = await bcrypt.genSalt(10);
    this.otp = await bcrypt.hash(this.otp, salt);
    next();
});

/**
 * Compare provided OTP with hashed OTP in DB
 * @param {string} candidateOtp - The OTP to verify
 * @returns {Promise<boolean>}
 */
otpSchema.methods.compareOtp = async function (candidateOtp) {
    return bcrypt.compare(candidateOtp, this.otp);
};

/**
 * Static: Generate a 6-digit OTP
 * @returns {string}
 */
otpSchema.statics.generateOtp = function () {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;
