import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';
const REMEMBER_ME_KEY = 'remember_me';
const ONBOARDING_COMPLETED_KEY = 'onboarding_completed';

export const authStorage = {
    // Save token
    async setToken(token: string) {
        try {
            await SecureStore.setItemAsync(TOKEN_KEY, token);
        } catch (error) {
            console.error('Error saving token:', error);
        }
    },

    // Get token
    async getToken(): Promise<string | null> {
        try {
            return await SecureStore.getItemAsync(TOKEN_KEY);
        } catch (error) {
            console.error('Error getting token:', error);
            return null;
        }
    },

    // Remove token
    async removeToken() {
        try {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
        } catch (error) {
            console.error('Error removing token:', error);
        }
    },

    // Save user data
    async setUser(user: any) {
        try {
            await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
        } catch (error) {
            console.error('Error saving user:', error);
        }
    },

    // Get user data
    async getUser(): Promise<any | null> {
        try {
            const userData = await SecureStore.getItemAsync(USER_KEY);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error getting user:', error);
            return null;
        }
    },

    // Remove user data
    async removeUser() {
        try {
            await SecureStore.deleteItemAsync(USER_KEY);
        } catch (error) {
            console.error('Error removing user:', error);
        }
    },

    // Save remember me preference
    async setRememberMe(remember: boolean) {
        try {
            await SecureStore.setItemAsync(REMEMBER_ME_KEY, remember ? 'true' : 'false');
        } catch (error) {
            console.error('Error saving remember me:', error);
        }
    },

    // Get remember me preference
    async getRememberMe(): Promise<boolean> {
        try {
            const value = await SecureStore.getItemAsync(REMEMBER_ME_KEY);
            return value === 'true';
        } catch (error) {
            console.error('Error getting remember me:', error);
            return false;
        }
    },

    // Mark onboarding as completed
    async setOnboardingCompleted() {
        try {
            await SecureStore.setItemAsync(ONBOARDING_COMPLETED_KEY, 'true');
        } catch (error) {
            console.error('Error saving onboarding status:', error);
        }
    },

    // Check if onboarding was completed
    async hasCompletedOnboarding(): Promise<boolean> {
        try {
            const value = await SecureStore.getItemAsync(ONBOARDING_COMPLETED_KEY);
            return value === 'true';
        } catch (error) {
            console.error('Error getting onboarding status:', error);
            return false;
        }
    },

    // Clear all auth data (but keep onboarding status)
    async clearAuth() {
        await this.removeToken();
        await this.removeUser();
        await SecureStore.deleteItemAsync(REMEMBER_ME_KEY);
    },
};


