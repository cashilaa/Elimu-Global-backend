import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, IsBoolean, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class ModuleProgressDto {
  @IsString()
  moduleId: string;

  @IsNumber()
  progress: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  completionDate?: Date;

  @IsOptional()
  @IsNumber()
  timeSpent?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  completedLectures?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  completedAssessments?: string[];
}

export class AssessmentScoreDto {
  @IsString()
  assessmentId: string;

  @IsNumber()
  score: number;

  @IsOptional()
  @IsNumber()
  attempts?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastAttemptDate?: Date;

  @IsOptional()
  @IsBoolean()
  passed?: boolean;
}

export class ProgressDto {
  @IsNumber()
  overallProgress: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastAccessDate?: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModuleProgressDto)
  moduleProgress: ModuleProgressDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssessmentScoreDto)
  assessmentScores?: AssessmentScoreDto[];

  @IsOptional()
  @IsNumber()
  totalTimeSpent?: number;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  completionDate?: Date;

  @IsOptional()
  @IsNumber()
  grade?: number;

  @IsOptional()
  @IsBoolean()
  certificateIssued?: boolean;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  certificateIssuedDate?: Date;
}
