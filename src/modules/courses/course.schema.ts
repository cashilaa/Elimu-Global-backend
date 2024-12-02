import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Resource {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  url: string;
}

@Schema({ timestamps: true })
export class Question {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true, type: [String] })
  options: string[];

  @Prop({ required: true })
  correctAnswer: string;

  @Prop()
  explanation: string;
}

@Schema({ timestamps: true })
export class Assessment {
  @Prop({ required: true })
  title: string;

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }] })
  questions: Question[];

  @Prop({ required: true })
  passingScore: number;

  @Prop({ required: true })
  timeLimit: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

@Schema({ timestamps: true })
export class Lecture {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  duration: number;

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }] })
  resources: Resource[];

  @Prop({ required: true, enum: ['video', 'text', 'quiz'] })
  type: string;
}

@Schema({ timestamps: true })
export class Module {
  @Prop({ type: MongooseSchema.Types.ObjectId })
  _id?: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  order: number;

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }] })
  lectures: Lecture[];

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }] })
  assessments: Assessment[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

@Schema({ timestamps: true })
export class Review {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Student' })
  student: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop()
  comment: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

@Schema({ timestamps: true })
export class Course extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Teacher' })
  instructor: string;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, enum: ['draft', 'published', 'archived'], default: 'draft' })
  status: string;

  @Prop({ required: true })
  category: string;

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }] })
  modules: Module[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId }], ref: 'Student' })
  enrolledStudents: string[];

  @Prop()
  thumbnail: string;

  @Prop({ default: 0, min: 0, max: 5 })
  rating: number;

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }] })
  reviews: Review[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ type: [{ 
    studentId: String, 
    overallProgress: Number,
    lastAccessDate: Date,
    moduleProgress: [{ 
      moduleId: String, 
      progress: Number,
      startDate: Date,
      completionDate: Date,
      timeSpent: Number,
      completedLectures: [String],
      completedAssessments: [String]
    }],
    assessmentScores: [{
      assessmentId: String,
      score: Number,
      attempts: Number,
      lastAttemptDate: Date
    }],
    totalTimeSpent: Number,
    completed: Boolean,
    completionDate: Date,
    grade: Number,
    certificateIssued: Boolean,
    certificateIssuedDate: Date,
    createdAt: Date,
    updatedAt: Date
  }], default: [] })
  studentProgress: {
    studentId: string;
    overallProgress?: number;
    lastAccessDate?: Date;
    moduleProgress?: {
      moduleId: string;
      progress: number;
      startDate?: Date;
      completionDate?: Date;
      timeSpent?: number;
      completedLectures?: string[];
      completedAssessments?: string[];
    }[];
    assessmentScores?: {
      assessmentId: string;
      score: number;
      attempts?: number;
      lastAttemptDate?: Date;
    }[];
    totalTimeSpent?: number;
    completed?: boolean;
    completionDate?: Date;
    grade?: number;
    certificateIssued?: boolean;
    certificateIssuedDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);
