/**
 * Helper function to convert image storage paths to full URLs
 * This ensures consistent URL generation across all API endpoints
 */

const getFullImageUrl = (profilePicture) => {
    // Default fallback image
    const defaultImage = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200';

    // Handle null/undefined/empty
    if (!profilePicture || profilePicture.trim() === '') {
        return defaultImage;
    }

    // Already a full HTTP/HTTPS URL - return as-is
    if (profilePicture.startsWith('http://') || profilePicture.startsWith('https://')) {
        return profilePicture;
    }

    // Let the frontend handle prefixing the correct base URL.
    // Just ensure path starts with /
    const path = profilePicture.startsWith('/') ? profilePicture : `/${profilePicture}`;

    return path;
};

module.exports = { getFullImageUrl };
