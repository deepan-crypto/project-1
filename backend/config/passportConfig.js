const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Configure Google OAuth 2.0 Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists with this Google ID
                let user = await User.findOne({ googleId: profile.id });

                if (user) {
                    // User exists, return user
                    return done(null, user);
                }

                // Check if user exists with same email
                const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
                if (email) {
                    user = await User.findOne({ email });

                    if (user) {
                        // Link Google account to existing user
                        user.googleId = profile.id;
                        user.isEmailVerified = true; // Google emails are verified
                        await user.save();
                        return done(null, user);
                    }
                }

                // Create new user
                const newUser = await User.create({
                    googleId: profile.id,
                    fullName: profile.displayName,
                    email: email,
                    username: email ? email.split('@')[0] + '_' + Date.now() : 'user_' + Date.now(),
                    authProvider: 'google',
                    isEmailVerified: true,
                    profilePicture: profile.photos && profile.photos[0] ? profile.photos[0].value : undefined,
                });

                done(null, newUser);
            } catch (error) {
                console.error('Google OAuth error:', error);
                done(error, null);
            }
        }
    )
);

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
