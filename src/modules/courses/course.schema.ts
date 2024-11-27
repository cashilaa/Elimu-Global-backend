import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Course extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  instructor: string;

  @Prop({ default: [] })
  students: string[];

  @Prop({ required: true })
  duration: number;

  @Prop({ default: 0 })
  price: number;

  @Prop({ default: [] })
  lessons: string[];

  @Prop({ default: 'draft', enum: ['draft', 'published', 'archived'] })
  status: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
