// Production backend hosted on AWS EC2, or use local during development
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://18.60.40.153:5000/api';

export default API_BASE_URL;




