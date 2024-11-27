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

- **Courses**
  - POST /courses - Create a course
  - GET /courses - Get all courses
  - GET /courses/:id - Get a specific course
  - POST /courses/:courseId/enroll/:studentId - Enroll a student in a course

- **Students**
  - POST /students - Create a student
  - GET /students - Get all students
  - GET /students/:id - Get a specific student
  - POST /students/:studentId/progress/:courseId - Update student's course progress

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
