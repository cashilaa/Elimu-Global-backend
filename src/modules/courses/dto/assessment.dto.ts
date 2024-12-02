import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, IsBoolean, IsEnum, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class QuestionOptionDto {
  @IsString()
  text: string;

  @IsOptional()
  @IsBoolean()
  isCorrect?: boolean;

  @IsOptional()
  @IsNumber()
  order?: number;
}

export class QuestionDto {
  @IsString()
  text: string;

  @IsEnum(['multiple-choice', 'true-false', 'short-answer', 'essay', 'matching', 'fill-blank'])
  type: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[];

  @IsOptional()
  @IsString({ each: true })
  correctAnswer?: string[];

  @IsNumber()
  points: number;

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class AssessmentDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];

  @IsOptional()
  @IsNumber()
  timeLimit?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsBoolean()
  isRandomized?: boolean;

  @IsOptional()
  @IsNumber()
  maxAttempts?: number;

  @IsOptional()
  @IsNumber()
  passingScore?: number;

  @IsOptional()
  @IsBoolean()
  showAnswers?: boolean;

  @IsOptional()
  @IsEnum(['never', 'after-submission', 'after-grading', 'after-due-date'])
  showAnswersTime?: string;

  @IsOptional()
  @IsEnum(['auto', 'manual'])
  gradingType?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredResources?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
