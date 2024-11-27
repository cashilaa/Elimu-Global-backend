import { IsString, IsNumber, IsArray, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  instructor: string;

  @ApiProperty()
  @IsNumber()
  duration: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  price: number;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  lessons: string[];

  @ApiProperty({ enum: ['draft', 'published', 'archived'] })
  @IsEnum(['draft', 'published', 'archived'])
  @IsOptional()
  status: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  category: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  thumbnail: string;
}
