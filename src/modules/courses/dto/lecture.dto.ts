import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUrl, IsNumber, Min, Max, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ResourceDto {
  @ApiProperty({ description: 'Title of the resource' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Type of resource (pdf, video, etc.)' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'URL of the resource' })
  @IsString()
  url: string;

  @ApiProperty({ description: 'Description of the resource' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class LectureDto {
  @ApiProperty({ description: 'Title of the lecture' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Description of the lecture' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Content or text of the lecture' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Type of lecture' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'Duration of the lecture in minutes' })
  @IsNumber()
  duration: number;

  @ApiProperty({ description: 'Resources associated with the lecture', type: () => [ResourceDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResourceDto)
  resources: ResourceDto[] = [];
}
