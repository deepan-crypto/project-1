// Production backend hosted on AWS EC2 via nginx reverse proxy on port 80
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://thoughts.co.in/api';

// Public-facing URL for share links (never expose the raw EC2 IP)
export const SHARE_BASE_URL = 'https://thoughts.co.in';

export default API_BASE_URL;
