# Elimu Global Backend

A comprehensive backend system for an educational platform built with NestJS and MongoDB Atlas.

## Features

- Course Management
- Student Management
- Course Enrollment System
- Progress Tracking
- RESTful API
- Swagger Documentation

## Tech Stack

- NestJS
- MongoDB Atlas
- TypeScript
- Mongoose ODM
- Class Validator
- Swagger UI

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account

## Installation

1. Clone the repository:
```bash
git clone https://github.com/cashilaa/Elimu-Global-backend.git
cd Elimu-Global-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your MongoDB connection string:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=3001
NODE_ENV=development
```

## Running the Application

1. Development mode:
```bash
npm run start:dev
```

2. Production mode:
```bash
npm run build
npm run start:prod
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:
```
http://localhost:3001/api
```

## API Endpoints

### Elimu Global Backend API Documentation

#### Authentication
All API endpoints require Bearer token authentication.

#### Base URL
```
http://localhost:3002
```

#### API Endpoints

##### Courses

###### Create a Course
- **POST** `/courses`
- **Description**: Create a new course
- **Auth**: Required
- **Body**: CreateCourseDto

###### Get All Courses
- **GET** `/courses`
- **Description**: Get all courses
- **Auth**: Required
- **Query Parameters**: Supports filtering

###### Get Course by ID
- **GET** `/courses/:id`
- **Description**: Get a specific course by ID
- **Auth**: Required
- **Parameters**: 
  - `id`: Course ID

###### Update Course
- **PATCH** `/courses/:id`
- **Description**: Update a course
- **Auth**: Required
- **Parameters**: 
  - `id`: Course ID
- **Body**: Partial<CreateCourseDto>

###### Delete Course
- **DELETE** `/courses/:id`
- **Description**: Delete a course
- **Auth**: Required
- **Parameters**: 
  - `id`: Course ID

###### Get Courses by Category
- **GET** `/courses/category/:category`
- **Description**: Get all courses in a specific category
- **Auth**: Required
- **Parameters**: 
  - `category`: Course category

###### Get Courses by Instructor
- **GET** `/courses/instructor/:instructorId`
- **Description**: Get all courses by a specific instructor
- **Auth**: Required
- **Parameters**: 
  - `instructorId`: Instructor ID

###### Enroll Student in Course
- **POST** `/courses/:id/enroll/:studentId`
- **Description**: Enroll a student in a course
- **Auth**: Required
- **Parameters**: 
  - `id`: Course ID
  - `studentId`: Student ID

###### Unenroll Student from Course
- **DELETE** `/courses/:id/enroll/:studentId`
- **Description**: Remove a student from a course
- **Auth**: Required
- **Parameters**: 
  - `id`: Course ID
  - `studentId`: Student ID

##### Students

###### Create a Student
- **POST** `/students`
- **Description**: Create a new student account
- **Auth**: Required
- **Body**: CreateStudentDto

###### Get All Students
- **GET** `/students`
- **Description**: Get all students
- **Auth**: Required
- **Query Parameters**: Supports filtering

###### Get Student by ID
- **GET** `/students/:id`
- **Description**: Get a specific student by ID
- **Auth**: Required
- **Parameters**: 
  - `id`: Student ID

###### Update Student
- **PATCH** `/students/:id`
- **Description**: Update a student's information
- **Auth**: Required
- **Parameters**: 
  - `id`: Student ID
- **Body**: Partial<CreateStudentDto>

###### Delete Student
- **DELETE** `/students/:id`
- **Description**: Delete a student account
- **Auth**: Required
- **Parameters**: 
  - `id`: Student ID

###### Find Student by Email
- **GET** `/students/email/:email`
- **Description**: Find a student by their email address
- **Auth**: Required
- **Parameters**: 
  - `email`: Student's email address

###### Enroll in Course
- **POST** `/students/:id/enroll/:courseId`
- **Description**: Enroll a student in a specific course
- **Auth**: Required
- **Parameters**: 
  - `id`: Student ID
  - `courseId`: Course ID

###### Update Course Progress
- **POST** `/students/:id/progress/:courseId`
- **Description**: Update a student's progress in a course
- **Auth**: Required
- **Parameters**: 
  - `id`: Student ID
  - `courseId`: Course ID
- **Body**: Progress information

###### Get Course Progress
- **GET** `/students/:id/progress/:courseId`
- **Description**: Get a student's progress in a specific course
- **Auth**: Required
- **Parameters**: 
  - `id`: Student ID
  - `courseId`: Course ID

#### Response Formats

All endpoints return data in JSON format. Successful responses will have a 2xx status code, while errors will have appropriate 4xx or 5xx status codes.

##### Success Response Format
```json
{
    "data": {
        // Response data here
    }
}
```

##### Error Response Format
```json
{
    "statusCode": 400,
    "message": "Error message here",
    "error": "Error type"
}
```

#### Rate Limiting

The API implements rate limiting to ensure fair usage. Please contact support for specific limits and enterprise solutions.

#### Support

For API support, please contact:
- Email: support@elimuglobal.com
- Documentation: https://docs.elimuglobal.com

## Testing

Run the test script:
```bash
node test-api.js
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT
