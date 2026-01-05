/// <reference types="vite/client" />

/**
 * Converts a profile picture path/URL to a display URL
 * The backend now generates full URLs, so we simply use them as-is
 */
export const getProfileImageUrl = (profilePicture?: string | null): string => {
    // Default fallback image
    const defaultImage = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200';

    // Handle null/undefined/empty
    if (!profilePicture || profilePicture.trim() === '') {
        return defaultImage;
    }

    // Backend provides full URLs - use as-is
    return profilePicture;
};
