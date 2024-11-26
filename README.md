# Elimu Global Learning Platform - Backend API Documentation

## Overview
Elimu Global is a comprehensive online learning platform built with NestJS and Supabase. This document provides detailed information about the available API endpoints.

## Base URL
```
Production: https://elimu-global-backend.onrender.com
Development: http://localhost:3001
```

## Authentication
All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Authentication

#### Register User
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "role": "student" | "instructor"
}

Response: {
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "student"
  },
  "token": "jwt_token"
}
```

#### Login User
```http
POST /auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response: {
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "student"
  },
  "token": "jwt_token"
}
```

#### Logout User
```http
POST /auth/signout
Authorization: Bearer <token>

Response: {
  "message": "Successfully logged out"
}
```

### Courses

#### Create Course (Authenticated - Instructor Only)
```http
POST /courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Course Title",
  "description": "Course Description",
  "category": "Programming",
  "level": "beginner" | "intermediate" | "advanced",
  "price": 29.99,
  "status": "draft" | "published"
}

Response: {
  "id": "uuid",
  "title": "Course Title",
  "description": "Course Description",
  "category": "Programming",
  "level": "beginner",
  "price": 29.99,
  "status": "draft",
  "instructorId": "uuid",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### Get All Courses
```http
GET /courses
Query Parameters:
  - category (optional)
  - level (optional)
  - status (optional)

Response: [
  {
    "id": "uuid",
    "title": "Course Title",
    "description": "Course Description",
    "category": "Programming",
    "level": "beginner",
    "price": 29.99,
    "status": "published",
    "instructorId": "uuid",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
]
```

#### Get Course by ID
```http
GET /courses/:id

Response: {
  "id": "uuid",
  "title": "Course Title",
  "description": "Course Description",
  "category": "Programming",
  "level": "beginner",
  "price": 29.99,
  "status": "published",
  "instructorId": "uuid",
  "lessons": [...],
  "reviews": [...],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### Update Course (Authenticated - Course Instructor Only)
```http
PUT /courses/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated Description",
  "category": "Programming",
  "level": "intermediate",
  "price": 39.99,
  "status": "published"
}

Response: {
  "id": "uuid",
  "title": "Updated Title",
  ...updated fields
}
```

#### Add Lesson to Course (Authenticated - Course Instructor Only)
```http
POST /courses/:id/lessons
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Lesson Title",
  "content": "Lesson Content",
  "order": 1
}

Response: {
  "id": "uuid",
  "title": "Lesson Title",
  "content": "Lesson Content",
  "order": 1,
  "courseId": "course_uuid",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### Enroll in Course (Authenticated - Students Only)
```http
POST /courses/:id/enroll
Authorization: Bearer <token>

Response: {
  "id": "uuid",
  "userId": "user_uuid",
  "courseId": "course_uuid",
  "status": "active",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### Add Review to Course (Authenticated - Enrolled Students Only)
```http
POST /courses/:id/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Great course!"
}

Response: {
  "id": "uuid",
  "rating": 5,
  "comment": "Great course!",
  "userId": "user_uuid",
  "courseId": "course_uuid",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## Error Responses

### Common Error Codes
- 400: Bad Request - Invalid input
- 401: Unauthorized - Missing or invalid token
- 403: Forbidden - Insufficient permissions
- 404: Not Found - Resource doesn't exist
- 500: Server Error - Internal server error

Error Response Format:
```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Error type"
}
```

## Rate Limiting
- 100 requests per IP per minute
- Applies to all endpoints

## Environment Variables
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
PORT=3001
FRONTEND_URL=your_frontend_url
```

## Development Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables
4. Run the development server:
   ```bash
   npm run start:dev
   ```

## Production Deployment
The API is deployed on Render and automatically deploys when changes are pushed to the main branch.

## Database Schema
The application uses Supabase with the following main tables:
- users
- profiles
- courses
- lessons
- enrollments
- reviews
- payments

For detailed schema information, refer to the migrations in the `supabase/migrations` directory.

## Security Features
- JWT Authentication
- Role-based access control
- Input validation
- CORS protection
- Rate limiting
- Secure password hashing

## Support
For any questions or issues, please open an issue in the GitHub repository.

## License
MIT License
