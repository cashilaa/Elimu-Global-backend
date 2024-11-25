import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import {
  CreateCourseDto,
  UpdateCourseDto,
  CreateLessonDto,
  CreateReviewDto,
} from '../../dtos/course.dto';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createCourse(@Request() req, @Body() dto: CreateCourseDto) {
    return this.coursesService.createCourse(req.user.id, dto);
  }

  @Get()
  async getCourses(
    @Query('category') category?: string,
    @Query('level') level?: string,
    @Query('status') status?: string,
  ) {
    return this.coursesService.getCourses({ category, level, status });
  }

  @Get(':id')
  async getCourseById(@Param('id') id: string) {
    return this.coursesService.getCourseById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateCourse(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.coursesService.updateCourse(req.user.id, id, dto);
  }

  @Post(':id/lessons')
  @UseGuards(AuthGuard)
  async createLesson(
    @Request() req,
    @Param('id') courseId: string,
    @Body() dto: CreateLessonDto,
  ) {
    return this.coursesService.createLesson(req.user.id, { ...dto, courseId });
  }

  @Post(':id/enroll')
  @UseGuards(AuthGuard)
  async enrollCourse(@Request() req, @Param('id') courseId: string) {
    return this.coursesService.enrollCourse(req.user.id, courseId);
  }

  @Post(':id/reviews')
  @UseGuards(AuthGuard)
  async createReview(
    @Request() req,
    @Param('id') courseId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.coursesService.createReview(req.user.id, { ...dto, courseId });
  }
}
