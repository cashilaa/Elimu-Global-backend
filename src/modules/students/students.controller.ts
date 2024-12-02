import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { Student } from './student.schema';

@ApiTags('students')
@Controller('students')
@ApiBearerAuth()
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new student' })
  create(@Body() createStudentDto: CreateStudentDto): Promise<Student> {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all students' })
  findAll(@Query() query: any): Promise<Student[]> {
    return this.studentsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a student by id' })
  findOne(@Param('id') id: string): Promise<Student> {
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a student' })
  update(
    @Param('id') id: string,
    @Body() updateStudentDto: Partial<CreateStudentDto>,
  ): Promise<Student> {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a student' })
  remove(@Param('id') id: string): Promise<void> {
    return this.studentsService.remove(id);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Find a student by email' })
  findByEmail(@Param('email') email: string): Promise<Student> {
    return this.studentsService.findByEmail(email);
  }

  @Post(':id/enroll/:courseId')
  @ApiOperation({ summary: 'Enroll student in a course' })
  enrollInCourse(
    @Param('id') studentId: string,
    @Param('courseId') courseId: string,
  ): Promise<Student> {
    return this.studentsService.enrollInCourse(studentId, courseId);
  }

  @Delete(':id/enroll/:courseId')
  @ApiOperation({ summary: 'Unenroll student from a course' })
  unenrollFromCourse(
    @Param('id') studentId: string,
    @Param('courseId') courseId: string,
  ): Promise<Student> {
    return this.studentsService.unenrollFromCourse(studentId, courseId);
  }

  @Post(':id/progress/:courseId')
  @ApiOperation({ summary: 'Update student progress in a course' })
  updateProgress(
    @Param('id') studentId: string,
    @Param('courseId') courseId: string,
    @Body() progress: any,
  ): Promise<Student> {
    return this.studentsService.updateProgress(studentId, courseId, progress);
  }

  @Get(':id/progress/:courseId')
  @ApiOperation({ summary: 'Get student progress in a course' })
  getProgress(
    @Param('id') studentId: string,
    @Param('courseId') courseId: string,
  ): Promise<any> {
    return this.studentsService.getProgress(studentId, courseId);
  }

  @Get(':id/courses')
  @ApiOperation({ summary: 'Get all courses enrolled by student' })
  getEnrolledCourses(@Param('id') studentId: string): Promise<any[]> {
    return this.studentsService.getEnrolledCourses(studentId);
  }

  @Get(':id/certificates')
  @ApiOperation({ summary: 'Get all certificates earned by student' })
  getCertificates(@Param('id') studentId: string): Promise<any[]> {
    return this.studentsService.getCertificates(studentId);
  }

  @Get(':id/achievements')
  @ApiOperation({ summary: 'Get student achievements and badges' })
  getAchievements(@Param('id') studentId: string): Promise<any> {
    return this.studentsService.getAchievements(studentId);
  }

  @Get(':id/analytics')
  @ApiOperation({ summary: 'Get student learning analytics' })
  getAnalytics(
    @Param('id') studentId: string,
    @Query('timeframe') timeframe?: string,
  ): Promise<any> {
    return this.studentsService.getAnalytics(studentId, timeframe);
  }

  @Patch(':id/preferences')
  @ApiOperation({ summary: 'Update student preferences' })
  updatePreferences(
    @Param('id') studentId: string,
    @Body() preferences: UpdatePreferencesDto,
  ): Promise<Student> {
    return this.studentsService.updatePreferences(studentId, preferences);
  }

  @Get(':id/notifications')
  @ApiOperation({ summary: 'Get student notifications' })
  getNotifications(
    @Param('id') studentId: string,
    @Query('status') status?: string,
  ): Promise<any[]> {
    return this.studentsService.getNotifications(studentId, status);
  }

  @Post(':id/notifications/:notificationId/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  markNotificationAsRead(
    @Param('id') studentId: string,
    @Param('notificationId') notificationId: string,
  ): Promise<void> {
    return this.studentsService.markNotificationAsRead(studentId, notificationId);
  }

  @Get(':id/schedule')
  @ApiOperation({ summary: 'Get student schedule' })
  getSchedule(
    @Param('id') studentId: string,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ): Promise<any[]> {
    return this.studentsService.getSchedule(studentId, startDate, endDate);
  }

  @Get(':id/meetings')
  @ApiOperation({ summary: 'Get student meetings' })
  getMeetings(
    @Param('id') studentId: string,
    @Query('status') status?: string,
  ): Promise<any[]> {
    return this.studentsService.getMeetings(studentId, status);
  }

  @Post(':id/meetings/:meetingId/join')
  @ApiOperation({ summary: 'Join a meeting' })
  joinMeeting(
    @Param('id') studentId: string,
    @Param('meetingId') meetingId: string,
  ): Promise<any> {
    return this.studentsService.joinMeeting(studentId, meetingId);
  }

  @Get(':id/payments')
  @ApiOperation({ summary: 'Get student payment history' })
  getPaymentHistory(@Param('id') studentId: string): Promise<any[]> {
    return this.studentsService.getPaymentHistory(studentId);
  }

  @Get(':id/subscriptions')
  @ApiOperation({ summary: 'Get student subscriptions' })
  getSubscriptions(@Param('id') studentId: string): Promise<any[]> {
    return this.studentsService.getSubscriptions(studentId);
  }
}
