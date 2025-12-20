## Features

- ✅ User authentication (signup, login, forgot/reset password)
- ✅ JWT-based authorization
- ✅ User profile management
- ✅ Profile picture uploads
- ✅ Follow/unfollow system
- ✅ Poll creation and voting
- ✅ Like/unlike polls
- ✅ Real-time notifications
- ✅ Input validation and error handling

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Nodemailer** - Email service

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Update the `.env` file with your MongoDB connection string and other settings:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### 3. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/forgot-password` | Request password reset | No |
| POST | `/api/auth/reset-password` | Reset password | No |

### Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/me` | Get current user | Yes |
| GET | `/api/users/profile/:userId` | Get user profile | No |
| PUT | `/api/users/profile` | Update profile | Yes |
| POST | `/api/users/upload-avatar` | Upload profile picture | Yes |
| POST | `/api/users/:userId/follow` | Follow user | Yes |
| DELETE | `/api/users/:userId/unfollow` | Unfollow user | Yes |
| GET | `/api/users/:userId/followers` | Get followers | No |
| GET | `/api/users/:userId/following` | Get following | No |
| GET | `/api/users/:userId/stats` | Get user stats | No |

### Polls

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/polls` | Create poll | Yes |
| GET | `/api/polls` | Get all polls (feed) | No |
| GET | `/api/polls/user/:userId` | Get user's polls | No |
| GET | `/api/polls/:pollId` | Get poll details | No |
| POST | `/api/polls/:pollId/vote` | Vote on poll | Yes |
| POST | `/api/polls/:pollId/like` | Like poll | Yes |
| DELETE | `/api/polls/:pollId/unlike` | Unlike poll | Yes |

### Notifications

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/notifications` | Get notifications | Yes |
| PUT | `/api/notifications/:notificationId/read` | Mark as read | Yes |
| PUT | `/api/notifications/read-all` | Mark all as read | Yes |

## Request/Response Examples

### Signup

**Request:**
```json
POST /api/auth/signup
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "password123",
  "dateOfBirth": "1990-01-01",
  "gender": "Male"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "profilePicture": "https://..."
  }
}
```

### Create Poll

**Request:**
```json
POST /api/polls
Authorization: Bearer <token>
{
  "question": "What's your favorite programming language?",
  "options": [
    "JavaScript",
    "Python",
    "Go"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Poll created successfully",
  "poll": {
    "_id": "507f1f77bcf86cd799439011",
    "question": "What's your favorite programming language?",
    "options": [...],
    "userId": {...},
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Vote on Poll

**Request:**
```json
POST /api/polls/:pollId/vote
Authorization: Bearer <token>
{
  "optionIndex": 0
}
```

**Response:**
```json
{
  "success": true,
  "message": "Vote recorded successfully",
  "poll": {...}
}
```

## Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── userController.js    # User operations
│   ├── pollController.js    # Poll operations
│   └── notificationController.js # Notifications
├── middleware/
│   ├── auth.js              # JWT verification
│   ├── errorHandler.js      # Error handling
│   └── upload.js            # File upload config
├── models/
│   ├── User.js              # User schema
│   ├── Poll.js              # Poll schema
│   └── Notification.js      # Notification schema
├── routes/
│   ├── auth.js              # Auth routes
│   ├── users.js             # User routes
│   ├── polls.js             # Poll routes
│   └── notifications.js     # Notification routes
├── utils/
│   └── emailService.js      # Email utilities
├── uploads/                 # Uploaded files
├── .env                     # Environment variables
├── .gitignore
├── package.json
└── server.js                # Entry point
```

## MongoDB Setup

### Option 1: MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### Option 2: Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/polling-app`

## Testing with MongoDB Compass

1. Open MongoDB Compass
2. Connect using your MONGODB_URI
3. After starting the server and making API calls, you'll see:
   - `users` collection
   - `polls` collection
   - `notifications` collection

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```



## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation
- CORS configuration
- File upload restrictions (images only, 5MB max)

## Notes

- Default profile pictures are from Pexels
- Password reset tokens expire in 1 hour
- JWT tokens expire in 7 days
- Uploaded images are stored in `/uploads/avatars/`
- Notifications are created automatically for likes, votes, and follows

## Support

For issues or questions, please refer to the implementation plan or contact the development team.
