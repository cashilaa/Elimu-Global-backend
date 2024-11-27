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
}
