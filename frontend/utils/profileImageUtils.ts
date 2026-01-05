import API_BASE_URL from '@/config/api';

/**
 * Converts a profile picture path/URL to a fully qualified URL
 * Handles various cases: null, HTTP URLs, relative paths
 * Adds cache busting parameter to prevent stale images
 */
export const getProfileImageUrl = (profilePicture?: string | null): string => {
    // Default fallback image
    const defaultImage = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200';

    // Handle null/undefined/empty
    if (!profilePicture || profilePicture.trim() === '') {
        return defaultImage;
    }

    // Already a full HTTP/HTTPS URL
    if (profilePicture.startsWith('http://') || profilePicture.startsWith('https://')) {
        // Add cache busting to prevent stale images
        return `${profilePicture}?t=${Date.now()}`;
    }

    // Relative path - construct full URL
    // Remove '/api' from API_BASE_URL and append the relative path
    const baseUrl = API_BASE_URL.replace('/api', '');

    // Ensure path starts with /
    const path = profilePicture.startsWith('/') ? profilePicture : `/${profilePicture}`;

    // Return full URL with cache busting
    return `${baseUrl}${path}?t=${Date.now()}`;
};
