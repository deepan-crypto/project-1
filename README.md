#📋 Deployment Checklist
Before deploying to production, you should:

Update API URL in 
frontend/config/api.ts
:
typescript
const API_BASE_URL = 'https://project-1-backend-r8r9.onrender.com/api';
Update CORS in 
backend/server.js
 for your frontend domain:
javascript
origin: 'https://your-frontend-domain.com'
Set environment variables on your server:
MONGODB_URI - Your production MongoDB connection
JWT_SECRET - A strong secret key
PORT - Server port
NODE_ENV=production
Socket.IO works on:
Heroku, Railway, Render ✅
Vercel (needs separate socket server) ⚠️
AWS, DigitalOcean ✅
🔒 Production Recommendations
Use HTTPS (required for WebSockets in production)
Add rate limiting for API endpoints
Enable MongoDB authentication
Consider Redis adapter for Socket.IO if scaling to multiple servers