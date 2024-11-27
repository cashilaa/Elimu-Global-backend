import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export interface CourseProgress {
  completedLessons: string[];
  lastCompletedLesson: string;
  progress: number;
}

@Schema({ timestamps: true })
export class Student extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: [] })
  enrolledCourses: string[];

  @Prop({ default: 'active', enum: ['active', 'inactive', 'suspended'] })
  status: string;

  @Prop()
  dateOfBirth: Date;

  @Prop()
  phoneNumber: string;

  @Prop({ 
    type: MongooseSchema.Types.Mixed, 
    default: {},
    validate: {
      validator: function(value: Record<string, CourseProgress>) {
        return Object.values(value).every(progress => 
          typeof progress === 'object' &&
          Array.isArray(progress.completedLessons) &&
          typeof progress.lastCompletedLesson === 'string' &&
          typeof progress.progress === 'number'
        );
      },
      message: 'Invalid progress format'
    }
  })
  progress: Record<string, CourseProgress>;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
