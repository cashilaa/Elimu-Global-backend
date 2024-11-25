import { IsString, IsNumber, IsEnum, IsOptional, Min, IsUUID, IsArray } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsEnum(['beginner', 'intermediate', 'advanced'])
  level: 'beginner' | 'intermediate' | 'advanced';

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;
}

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsEnum(['beginner', 'intermediate', 'advanced'])
  level?: 'beginner' | 'intermediate' | 'advanced';

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsEnum(['draft', 'published', 'archived'])
  status?: 'draft' | 'published' | 'archived';
}

export class CreateLessonDto {
  @IsUUID()
  courseId: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsNumber()
  order: number;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsNumber()
  duration?: number;
}

export class EnrollCourseDto {
  @IsUUID()
  courseId: string;
}

export class CreateReviewDto {
  @IsUUID()
  courseId: string;

  @IsNumber()
  @Min(1)
  rating: number;

  @IsString()
  comment: string;
}
