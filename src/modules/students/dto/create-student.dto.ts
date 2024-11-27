import { IsString, IsEmail, IsOptional, IsEnum, IsArray, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  enrolledCourses: string[];

  @ApiProperty({ enum: ['active', 'inactive', 'suspended'], default: 'active' })
  @IsEnum(['active', 'inactive', 'suspended'])
  @IsOptional()
  status: string;

  @ApiProperty({ required: false })
  @IsDate()
  @IsOptional()
  dateOfBirth: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({ required: false })
  @IsOptional()
  progress: Record<string, any>;
}
