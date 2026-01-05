/// <reference types="vite/client" />

// Get the API base URL for constructing full image URLs
const getApiBaseUrl = (): string => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    return apiUrl.replace('/api', '');
};

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
    const baseUrl = getApiBaseUrl();

    // Ensure path starts with /
    const path = profilePicture.startsWith('/') ? profilePicture : `/${profilePicture}`;

    // Return full URL with cache busting
    return `${baseUrl}${path}?t=${Date.now()}`;
};
