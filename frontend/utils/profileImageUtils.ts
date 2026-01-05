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

    // Add cache-busting timestamp to force refresh
    const separator = profilePicture.includes('?') ? '&' : '?';
    return `${profilePicture}${separator}t=${Date.now()}`;
};

