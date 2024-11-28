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
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { Teacher } from './teacher.schema';

@ApiTags('teachers')
@Controller('teachers')
@ApiBearerAuth()
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new teacher' })
  create(@Body() createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    return this.teachersService.create(createTeacherDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all teachers' })
  findAll(@Query() query: any): Promise<Teacher[]> {
    return this.teachersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a teacher by id' })
  findOne(@Param('id') id: string): Promise<Teacher> {
    return this.teachersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a teacher' })
  update(
    @Param('id') id: string,
    @Body() updateTeacherDto: Partial<CreateTeacherDto>,
  ): Promise<Teacher> {
    return this.teachersService.update(id, updateTeacherDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a teacher' })
  remove(@Param('id') id: string): Promise<void> {
    return this.teachersService.remove(id);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Find a teacher by email' })
  findByEmail(@Param('email') email: string): Promise<Teacher> {
    return this.teachersService.findByEmail(email);
  }

  @Get(':id/courses')
  @ApiOperation({ summary: 'Get courses taught by a teacher' })
  getTeacherCourses(@Param('id') id: string): Promise<any[]> {
    return this.teachersService.getTeacherCourses(id);
  }

  @Post(':id/courses/:courseId')
  @ApiOperation({ summary: 'Assign a course to a teacher' })
  assignCourse(
    @Param('id') teacherId: string,
    @Param('courseId') courseId: string,
  ): Promise<Teacher> {
    return this.teachersService.assignCourse(teacherId, courseId);
  }

  @Delete(':id/courses/:courseId')
  @ApiOperation({ summary: 'Remove a course from a teacher' })
  removeCourse(
    @Param('id') teacherId: string,
    @Param('courseId') courseId: string,
  ): Promise<Teacher> {
    return this.teachersService.removeCourse(teacherId, courseId);
  }
}
