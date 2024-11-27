const axios = require('axios');

const API_URL = 'http://localhost:3001';
let createdCourseId;
let createdStudentId;

async function testAPI() {
  try {
    // 1. Test Course Creation
    console.log('\n1. Testing Course Creation...');
    const courseData = {
      title: 'Introduction to Programming',
      description: 'Learn the basics of programming with this comprehensive course',
      instructor: 'John Doe',
      duration: 120,
      price: 99.99,
      status: 'published',
      category: 'Programming',
      lessons: ['Introduction', 'Variables', 'Control Flow']
    };
    
    const courseResponse = await axios.post(`${API_URL}/courses`, courseData);
    console.log('✅ Course created successfully:', courseResponse.data);
    createdCourseId = courseResponse.data._id || courseResponse.data.data._id;

    // 2. Test Student Creation
    console.log('\n2. Testing Student Creation...');
    const studentData = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phoneNumber: '1234567890',
      status: 'active'
    };
    
    const studentResponse = await axios.post(`${API_URL}/students`, studentData);
    console.log('✅ Student created successfully:', studentResponse.data);
    createdStudentId = studentResponse.data._id || studentResponse.data.data._id;

    // 3. Test Get All Courses
    console.log('\n3. Testing Get All Courses...');
    const allCoursesResponse = await axios.get(`${API_URL}/courses`);
    console.log('✅ Retrieved all courses:', allCoursesResponse.data);

    // 4. Test Get All Students
    console.log('\n4. Testing Get All Students...');
    const allStudentsResponse = await axios.get(`${API_URL}/students`);
    console.log('✅ Retrieved all students:', allStudentsResponse.data);

    // 5. Test Course Enrollment
    console.log('\n5. Testing Course Enrollment...');
    const enrollmentResponse = await axios.post(
      `${API_URL}/courses/${createdCourseId}/enroll/${createdStudentId}`
    );
    console.log('✅ Enrollment successful:', enrollmentResponse.data);

    // 6. Test Student Progress Update
    console.log('\n6. Testing Student Progress Update...');
    const progressData = {
      completedLessons: ['Introduction'],
      lastCompletedLesson: 'Introduction',
      progress: 33
    };
    
    const progressResponse = await axios.post(
      `${API_URL}/students/${createdStudentId}/progress/${createdCourseId}`,
      progressData
    );
    console.log('✅ Progress updated:', progressResponse.data);

    // 7. Test Get Single Course
    console.log('\n7. Testing Get Single Course...');
    const singleCourseResponse = await axios.get(`${API_URL}/courses/${createdCourseId}`);
    console.log('✅ Retrieved single course:', singleCourseResponse.data);

    // 8. Test Get Single Student
    console.log('\n8. Testing Get Single Student...');
    const singleStudentResponse = await axios.get(`${API_URL}/students/${createdStudentId}`);
    console.log('✅ Retrieved single student:', singleStudentResponse.data);

    console.log('\n✅ All tests completed successfully!');
    console.log('\nAPI Endpoints tested:');
    console.log('- POST /courses (Create Course)');
    console.log('- POST /students (Create Student)');
    console.log('- GET /courses (Get All Courses)');
    console.log('- GET /students (Get All Students)');
    console.log('- POST /courses/:courseId/enroll/:studentId (Enroll Student)');
    console.log('- POST /students/:studentId/progress/:courseId (Update Progress)');
    console.log('- GET /courses/:id (Get Single Course)');
    console.log('- GET /students/:id (Get Single Student)');

  } catch (error) {
    console.error('\n❌ Error during testing:', error.response?.data || error.message);
    console.error('\nFull error:', error);
  }
}

// Install axios if not already installed
const { execSync } = require('child_process');
try {
  require.resolve('axios');
} catch (e) {
  console.log('Installing axios...');
  execSync('npm install axios', { stdio: 'inherit' });
}

// Run the tests
console.log('Starting API tests...');
console.log(`API URL: ${API_URL}`);
testAPI();
