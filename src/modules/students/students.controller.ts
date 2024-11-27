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
}
