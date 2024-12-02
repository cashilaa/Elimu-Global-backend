import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { Course } from './course.schema';
import { ModuleDto } from './dto/module.dto';
import { LectureDto } from './dto/lecture.dto';
import { AssessmentDto } from './dto/assessment.dto';
import { ProgressDto } from './dto/progress.dto';

@ApiTags('courses')
@Controller('courses')
@ApiBearerAuth()
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new course' })
  create(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses' })
  findAll(@Query() query: any): Promise<Course[]> {
    return this.coursesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a course by id' })
  findOne(@Param('id') id: string): Promise<Course> {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a course' })
  update(
    @Param('id') id: string,
    @Body() updateCourseDto: Partial<CreateCourseDto>,
  ): Promise<Course> {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a course' })
  remove(@Param('id') id: string): Promise<void> {
    return this.coursesService.remove(id);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get courses by category' })
  findByCategory(@Param('category') category: string): Promise<Course[]> {
    return this.coursesService.findByCategory(category);
  }

  @Get('instructor/:instructorId')
  @ApiOperation({ summary: 'Get courses by instructor' })
  findByInstructor(@Param('instructorId') instructorId: string): Promise<Course[]> {
    return this.coursesService.findByInstructor(instructorId);
  }

  @Post(':id/enroll/:studentId')
  @ApiOperation({ summary: 'Enroll a student in a course' })
  enrollStudent(
    @Param('id') courseId: string,
    @Param('studentId') studentId: string,
  ): Promise<Course> {
    return this.coursesService.enrollStudent(courseId, studentId);
  }

  @Delete(':id/enroll/:studentId')
  @ApiOperation({ summary: 'Unenroll a student from a course' })
  unenrollStudent(
    @Param('id') courseId: string,
    @Param('studentId') studentId: string,
  ): Promise<Course> {
    return this.coursesService.unenrollStudent(courseId, studentId);
  }

  @Post(':id/modules')
  @ApiOperation({ summary: 'Add a module to a course' })
  addModule(
    @Param('id') courseId: string,
    @Body() moduleDto: ModuleDto,
  ): Promise<Course> {
    return this.coursesService.addModule(courseId, moduleDto);
  }

  @Patch(':id/modules/:moduleId')
  @ApiOperation({ summary: 'Update a module in a course' })
  updateModule(
    @Param('id') courseId: string,
    @Param('moduleId') moduleId: string,
    @Body() moduleDto: Partial<ModuleDto>,
  ): Promise<Course> {
    return this.coursesService.updateModule(courseId, moduleId, moduleDto);
  }

  @Get(':id/modules')
  @ApiOperation({ summary: 'Get all modules in a course' })
  getModules(@Param('id') courseId: string): Promise<Course> {
    return this.coursesService.getModules(courseId);
  }

  @Post(':id/modules/:moduleId/lectures')
  @ApiOperation({ summary: 'Add a lecture to a module' })
  addLecture(
    @Param('id') courseId: string,
    @Param('moduleId') moduleId: string,
    @Body() lectureDto: LectureDto,
  ): Promise<Course> {
    return this.coursesService.addLecture(courseId, moduleId, lectureDto);
  }

  @Post(':id/modules/:moduleId/assessments')
  @ApiOperation({ summary: 'Create an assessment in a module' })
  createAssessment(
    @Param('id') courseId: string,
    @Param('moduleId') moduleId: string,
    @Body() assessmentDto: AssessmentDto,
  ): Promise<Course> {
    return this.coursesService.createAssessment(courseId, moduleId, assessmentDto);
  }

  @Post(':id/modules/:moduleId/assessments/:assessmentId/submit')
  @ApiOperation({ summary: 'Submit an assessment' })
  submitAssessment(
    @Param('id') courseId: string,
    @Param('moduleId') moduleId: string,
    @Param('assessmentId') assessmentId: string,
    @Query('studentId') studentId: string,
    @Body() submissionData: any,
  ): Promise<any> {
    return this.coursesService.submitAssessment(
      courseId,
      moduleId,
      assessmentId,
      studentId,
      submissionData,
    );
  }

  @Post(':id/progress/:studentId')
  @ApiOperation({ summary: 'Update student progress in a course' })
  updateProgress(
    @Param('id') courseId: string,
    @Param('studentId') studentId: string,
    @Body() progressDto: ProgressDto,
  ): Promise<any> {
    return this.coursesService.updateProgress(courseId, studentId, progressDto);
  }

  @Get(':id/progress/:studentId')
  @ApiOperation({ summary: 'Get student progress in a course' })
  getProgress(
    @Param('id') courseId: string,
    @Param('studentId') studentId: string,
  ): Promise<any> {
    return this.coursesService.getProgress(courseId, studentId);
  }

  @Post(':id/certificate/:studentId')
  @ApiOperation({ summary: 'Generate course completion certificate' })
  generateCertificate(
    @Param('id') courseId: string,
    @Param('studentId') studentId: string,
  ): Promise<any> {
    return this.coursesService.generateCertificate(courseId, studentId);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search courses' })
  searchCourses(@Query('query') query: string): Promise<Course[]> {
    return this.coursesService.searchCourses(query);
  }

  @Get('recommended/:studentId')
  @ApiOperation({ summary: 'Get recommended courses for a student' })
  getRecommendedCourses(@Param('studentId') studentId: string): Promise<Course[]> {
    return this.coursesService.getRecommendedCourses(studentId);
  }
}
