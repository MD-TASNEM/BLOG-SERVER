# Digital Life Lessons API Documentation

## Base URL
```
https://your-domain.com/api
```

## Authentication
All protected routes require Firebase ID token in Authorization header:
```
Authorization: Bearer <firebase_id_token>
```

## User Routes

### Create User Profile
```
POST /api/users/create-user
```
Protected: Yes

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "photoURL": "https://example.com/photo.jpg"
}
```

### Get User Profile
```
GET /api/users/profile/:uid
```
Protected: Yes

### Update User Profile
```
PATCH /api/users/profile/:uid
```
Protected: Yes

**Request Body:**
```json
{
  "name": "John Updated",
  "photoURL": "https://example.com/new-photo.jpg"
}
```

## Lesson Routes

### Create Lesson
```
POST /api/lessons/create-lesson
```
Protected: Yes

**Request Body:**
```json
{
  "title": "Lesson Title",
  "description": "Full lesson description",
  "category": "Personal Growth",
  "emotionalTone": "Motivational",
  "image": "https://example.com/image.jpg",
  "visibility": "public",
  "accessLevel": "free"
}
```

### Get Public Lessons
```
GET /api/lessons/public-lessons
```
Protected: No

**Query Parameters:**
- page: Page number (default: 1)
- limit: Items per page (default: 10)
- category: Filter by category
- emotionalTone: Filter by emotional tone
- search: Search in title and description
- sortBy: Sort field (createdAt, likesCount, favoritesCount, views)
- sortOrder: Sort order (asc, desc)
- accessLevel: Filter by access level

### Get User's Lessons
```
GET /api/lessons/my-lessons
```
Protected: Yes

### Get Lesson Details
```
GET /api/lessons/lesson/:id
```
Protected: No

### Update Lesson
```
PATCH /api/lessons/lesson/:id
```
Protected: Yes

### Delete Lesson
```
DELETE /api/lessons/lesson/:id
```
Protected: Yes

### Like/Unlike Lesson
```
POST /api/lessons/lesson/:id/like
```
Protected: Yes

### Get Featured Lessons
```
GET /api/lessons/featured-lessons
```
Protected: No

### Get Similar Lessons
```
GET /api/lessons/similar-lessons/:id
```
Protected: No

## Favorites Routes

### Add to Favorites
```
POST /api/favorites/add-favorite
```
Protected: Yes

**Request Body:**
```json
{
  "lessonId": "lesson_id"
}
```

### Remove from Favorites
```
DELETE /api/favorites/favorite/:lessonId
```
Protected: Yes

### Get User's Favorites
```
GET /api/favorites/my-favorites
```
Protected: Yes

### Check if Favorited
```
GET /api/favorites/is-favorite/:lessonId
```
Protected: Yes

## Comments Routes

### Add Comment
```
POST /api/comments/lesson/:id/comment
```
Protected: Yes

**Request Body:**
```json
{
  "text": "Comment text"
}
```

### Get Lesson Comments
```
GET /api/comments/lesson/:id/comments
```
Protected: No

## Reports Routes

### Create Report
```
POST /api/reports/create-report
```
Protected: Yes

**Request Body:**
```json
{
  "lessonId": "lesson_id",
  "reason": "Inappropriate Content",
  "description": "Optional description"
}
```

## Payment Routes

### Create Checkout Session
```
POST /api/payments/create-checkout-session
```
Protected: Yes

### Check Payment Status
```
POST /api/payments/check-payment-status
```
Protected: Yes

**Request Body:**
```json
{
  "sessionId": "stripe_session_id"
}
```

### Stripe Webhook
```
POST /api/payments/webhook
```
Protected: No (Stripe signature verification)

## Admin Routes

### Get Dashboard Analytics
```
GET /api/admin/dashboard
```
Protected: Yes (Admin only)

### Manage Users
```
GET /api/admin/manage-users
```
Protected: Yes (Admin only)

### Manage Lessons
```
GET /api/admin/manage-lessons
```
Protected: Yes (Admin only)

### Get Reported Lessons
```
GET /api/admin/reported-lessons
```
Protected: Yes (Admin only)

### Delete User
```
DELETE /api/admin/user/:userId
```
Protected: Yes (Admin only)

## Error Responses

All errors return JSON format:
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "stack": "Stack trace (development only)"
  }
}
```

## Rate Limits

- General API: 100 requests per 15 minutes
- Authentication: 5 requests per 15 minutes
- Lesson Creation: 10 lessons per hour
- Comments: 5 comments per minute
