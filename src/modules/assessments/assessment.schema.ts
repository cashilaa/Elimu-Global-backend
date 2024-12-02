import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Question {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true, enum: ['multiple-choice', 'true-false', 'short-answer', 'essay', 'matching', 'fill-blank'] })
  type: string;

  @Prop({ type: [String] })
  options: string[];

  @Prop()
  correctAnswer: string | string[];

  @Prop()
  points: number;

  @Prop()
  explanation: string;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ type: MongooseSchema.Types.Mixed })
  metadata: Record<string, any>;
}

@Schema()
export class StudentResponse {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Student' })
  studentId: string;

  @Prop({ type: [MongooseSchema.Types.Mixed] })
  answers: Record<string, any>[];

  @Prop()
  score: number;

  @Prop()
  feedback: string;

  @Prop({ default: 'pending', enum: ['pending', 'graded', 'needs-review'] })
  status: string;

  @Prop()
  submittedAt: Date;

  @Prop()
  gradedAt: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Teacher' })
  gradedBy: string;
}

@Schema({ timestamps: true })
export class Assessment extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Course' })
  courseId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Module' })
  moduleId: string;

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }] })
  questions: Question[];

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }] })
  responses: StudentResponse[];

  @Prop()
  timeLimit: number;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ default: false })
  isRandomized: boolean;

  @Prop({ default: 1 })
  maxAttempts: number;

  @Prop()
  passingScore: number;

  @Prop({ default: false })
  showAnswers: boolean;

  @Prop({ default: 'after-submission', enum: ['never', 'after-submission', 'after-grading', 'after-due-date'] })
  showAnswersTime: string;

  @Prop({ default: 'manual', enum: ['auto', 'manual'] })
  gradingType: string;

  @Prop({ type: [String] })
  requiredResources: string[];

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ type: MongooseSchema.Types.Mixed })
  settings: {
    shuffleQuestions?: boolean;
    shuffleOptions?: boolean;
    requireLockdownBrowser?: boolean;
    requireProctoring?: boolean;
    allowCalculator?: boolean;
    allowNotes?: boolean;
    [key: string]: any;
  };

  @Prop({ type: MongooseSchema.Types.Mixed })
  statistics: {
    averageScore?: number;
    medianScore?: number;
    highestScore?: number;
    lowestScore?: number;
    completionRate?: number;
    questionStats?: Record<string, any>;
    [key: string]: any;
  };

  @Prop({ default: 'draft', enum: ['draft', 'published', 'archived'] })
  status: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  metadata: Record<string, any>;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
export const StudentResponseSchema = SchemaFactory.createForClass(StudentResponse);
export const AssessmentSchema = SchemaFactory.createForClass(Assessment);
