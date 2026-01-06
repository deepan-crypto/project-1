import API_BASE_URL from '@/config/api';

/**
 * Get the full URL for a profile image with cache-busting
 * @param profilePicture - The profile picture URL/path from the backend
 * @returns Full URL to the profile image with timestamp for cache-busting
 */
export const getProfileImageUrl = (profilePicture?: string | null): string => {
    // Default fallback image
    const defaultImage = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200';

    // Handle null/undefined/empty
    if (!profilePicture || profilePicture.trim() === '') {
        return defaultImage;
    }

    let fullUrl = profilePicture;

    // Convert relative paths to full URLs
    if (!profilePicture.startsWith('http')) {
        // Remove '/api' from base URL and append the profile picture path
        const baseUrl = API_BASE_URL.replace('/api', '');
        fullUrl = `${baseUrl}${profilePicture}`;
    }

    // Add cache-busting timestamp to force refresh
    const separator = fullUrl.includes('?') ? '&' : '?';
    return `${fullUrl}${separator}t=${Date.now()}`;
};

