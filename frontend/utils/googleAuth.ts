import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Crypto from 'expo-crypto';
import { Platform } from 'react-native';
import API_BASE_URL from '@/config/api';

// Enable web browser to close properly on Android
WebBrowser.maybeCompleteAuthSession();

// Configuration
const GOOGLE_CLIENT_ID = '1031360484768-f4fg0erd1jonitna1t0uvm6shabqettq.apps.googleusercontent.com';

// Discovery endpoint for Google OAuth
const discovery = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

/**
 * Configure Google Sign-In with Expo Auth Session
 */
export const createGoogleAuthRequest = () => {
    // Use proxy redirect for Expo Go
    const redirectUri = AuthSession.makeRedirectUri({
        native: 'myapp://auth/callback', // Custom scheme for production
        useProxy: true, // Use Expo proxy for development
    });

    console.log('Google OAuth Redirect URI:', redirectUri);

    return {
        clientId: GOOGLE_CLIENT_ID,
        redirectUri,
        scopes: ['openid', 'profile', 'email'],
        responseType: AuthSession.ResponseType.Code,
        usePKCE: true, // Use PKCE for security
    };
};

/**
 * Initiate Google Sign-In flow
 * @returns {Promise<Object>} User data and token
 */
export const signInWithGoogle = async () => {
    try {
        const config = createGoogleAuthRequest();

        // Create code verifier for PKCE
        const codeVerifier = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            Crypto.getRandomBytes(32).toString()
        );

        const request = new AuthSession.AuthRequest({
            ...config,
            codeChallenge: codeVerifier,
            codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
        });

        await request.promptAsync(discovery);

        if (request.state === 'error') {
            throw new Error('Google authentication failed');
        }

        // Exchange code for token via your backend
        if (request.type === 'success' && request.params.code) {
            const response = await fetch(`${API_BASE_URL}/auth/google/callback?mobile=true`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: request.params.code,
                    redirectUri: config.redirectUri,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to authenticate with Google');
            }

            return {
                success: true,
                token: data.token,
                user: data.user,
            };
        }

        return { success: false, error: 'Authentication cancelled' };
    } catch (error) {
        console.error('Google Sign-In Error:', error);
        return {
            success: false,
            error: error.message || 'Failed to sign in with Google',
        };
    }
};

/**
 * Alternative: Direct backend OAuth flow
 * Opens browser to backend OAuth endpoint
 */
export const signInWithGoogleBackend = async () => {
    try {
        const redirectUri = AuthSession.makeRedirectUri({
            native: 'myapp://auth/callback',
            useProxy: false,
        });

        const authUrl = `${API_BASE_URL}/auth/google`;

        const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

        if (result.type === 'success' && result.url) {
            // Extract token from URL
            const url = new URL(result.url);
            const token = url.searchParams.get('token');
            const userId = url.searchParams.get('userId');

            if (token) {
                // Fetch user data
                const userResponse = await fetch(`${API_BASE_URL}/users/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const userData = await userResponse.json();

                return {
                    success: true,
                    token,
                    user: userData.user,
                };
            }
        }

        return { success: false, error: 'Authentication cancelled or failed' };
    } catch (error) {
        console.error('Google Backend OAuth Error:', error);
        return {
            success: false,
            error: error.message || 'Failed to sign in with Google',
        };
    }
};

/**
 * Get user info from Google (if needed)
 * @param {string} accessToken - Google access token
 */
export const getGoogleUserInfo = async (accessToken: string) => {
    try {
        const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to get user info');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching Google user info:', error);
        throw error;
    }
};
