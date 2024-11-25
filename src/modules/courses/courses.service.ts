import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { CreateCourseDto, UpdateCourseDto, CreateLessonDto, CreateReviewDto } from '../../dtos/course.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createCourse(userId: string, dto: CreateCourseDto) {
    const supabase = this.supabaseService.getClient();

    // Verify user is an instructor
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (user?.role !== 'instructor') {
      throw new ForbiddenException('Only instructors can create courses');
    }

    const { data: course, error } = await supabase
      .from('courses')
      .insert({
        ...dto,
        instructor_id: userId,
        status: 'draft',
      })
      .select()
      .single();

    if (error) throw error;
    return course;
  }

  async getCourses(filters?: { category?: string; level?: string; status?: string }) {
    const supabase = this.supabaseService.getClient();
    let query = supabase.from('courses').select('*, users!courses_instructor_id_fkey(first_name, last_name)');

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.level) {
      query = query.eq('level', filters.level);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data: courses, error } = await query;
    if (error) throw error;
    return courses;
  }

  async getCourseById(courseId: string) {
    const supabase = this.supabaseService.getClient();
    const { data: course, error } = await supabase
      .from('courses')
      .select('*, users!courses_instructor_id_fkey(first_name, last_name), lessons(*)')
      .eq('id', courseId)
      .single();

    if (error || !course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async updateCourse(userId: string, courseId: string, dto: UpdateCourseDto) {
    const supabase = this.supabaseService.getClient();
    
    // Verify course ownership
    const { data: course } = await supabase
      .from('courses')
      .select('instructor_id')
      .eq('id', courseId)
      .single();

    if (!course || course.instructor_id !== userId) {
      throw new ForbiddenException('You can only update your own courses');
    }

    const { data: updatedCourse, error } = await supabase
      .from('courses')
      .update(dto)
      .eq('id', courseId)
      .select()
      .single();

    if (error) throw error;
    return updatedCourse;
  }

  async createLesson(userId: string, dto: CreateLessonDto) {
    const supabase = this.supabaseService.getClient();
    
    // Verify course ownership
    const { data: course } = await supabase
      .from('courses')
      .select('instructor_id')
      .eq('id', dto.courseId)
      .single();

    if (!course || course.instructor_id !== userId) {
      throw new ForbiddenException('You can only add lessons to your own courses');
    }

    const { data: lesson, error } = await supabase
      .from('lessons')
      .insert({
        course_id: dto.courseId,
        title: dto.title,
        content: dto.content,
        order: dto.order,
        video_url: dto.videoUrl,
        duration: dto.duration,
      })
      .select()
      .single();

    if (error) throw error;
    return lesson;
  }

  async enrollCourse(userId: string, courseId: string) {
    const supabase = this.supabaseService.getClient();

    // Check if already enrolled
    const { data: existingEnrollment } = await supabase
      .from('enrollments')
      .select()
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();

    if (existingEnrollment) {
      throw new ForbiddenException('Already enrolled in this course');
    }

    const { data: enrollment, error } = await supabase
      .from('enrollments')
      .insert({
        user_id: userId,
        course_id: courseId,
        status: 'active',
        progress: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return enrollment;
  }

  async createReview(userId: string, dto: CreateReviewDto) {
    const supabase = this.supabaseService.getClient();

    // Verify enrollment
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select()
      .eq('user_id', userId)
      .eq('course_id', dto.courseId)
      .single();

    if (!enrollment) {
      throw new ForbiddenException('You must be enrolled in the course to review it');
    }

    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        user_id: userId,
        course_id: dto.courseId,
        rating: dto.rating,
        comment: dto.comment,
      })
      .select()
      .single();

    if (error) throw error;
    return review;
  }
}
