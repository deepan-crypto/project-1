/**
 * Get the full URL for a profile image
 * The backend now generates full URLs, so we simply use them as-is
 * @param profilePicture - The profile picture URL/path from the backend
 * @returns Full URL to the profile image
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

