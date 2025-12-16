# API Testing Guide

Quick commands to test the backend API using curl.

## 1. Test Server Health

```bash
curl http://localhost:5000/
```

Expected: `{"success":true,"message":"Polling App API is running","version":"1.0.0"}`

## 2. Test Signup

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "username": "testuser",
    "password": "Test123!",
    "dateOfBirth": "1990-01-01",
    "gender": "Male"
  }'
```

Save the `token` from the response!

## 3. Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test123!"
  }'
```

## 4. Test Create Poll (Replace YOUR_TOKEN)

```bash
curl -X POST http://localhost:5000/api/polls \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "question": "What is your favorite programming language?",
    "options": ["JavaScript", "Python", "TypeScript", "Go"]
  }'
```

## 5. Test Get Polls

```bash
curl http://localhost:5000/api/polls
```

## 6. Test Vote (Replace POLL_ID and YOUR_TOKEN)

```bash
curl -X POST http://localhost:5000/api/polls/POLL_ID/vote \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"optionIndex": 0}'
```

## 7. Test Like Poll (Replace POLL_ID and YOUR_TOKEN)

```bash
curl -X POST http://localhost:5000/api/polls/POLL_ID/like \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 8. Test Get Current User (Replace YOUR_TOKEN)

```bash
curl http://localhost:5000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 9. Test Update Profile (Replace YOUR_TOKEN)

```bash
curl -X PUT http://localhost:5000/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "username": "updateduser",
    "bio": "This is my new bio!"
  }'
```

## 10. Test Get Notifications (Replace YOUR_TOKEN)

```bash
curl http://localhost:5000/api/notifications \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Notes

- Replace `YOUR_TOKEN` with the actual JWT token from signup/login
- Replace `POLL_ID` with an actual poll ID from the create poll response
- Replace `USER_ID` with an actual user ID when testing follow/unfollow
- For file uploads (avatar), use `--form` or a tool like Postman

## Postman Alternative

Import these as a Postman collection for easier testing with a GUI.
