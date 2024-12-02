import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class AssessmentScore {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Assessment' })
  assessmentId: string;

  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  attemptDate: Date;

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }] })
  answers: any[];
}

@Schema({ timestamps: true })
export class ModuleProgress {
  @Prop({ required: true })
  moduleId: string;

  @Prop({ type: [String] })
  completedLectures: string[];

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }] })
  assessmentScores: AssessmentScore[];

  @Prop({ default: 0 })
  progressPercentage: number;

  @Prop({ default: Date.now })
  lastAccessed: Date;
}

@Schema({ timestamps: true })
export class CourseProgress {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Course' })
  courseId: string;

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }] })
  moduleProgress: ModuleProgress[];

  @Prop({ type: [String] })
  completedLectures: string[];

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }] })
  assessmentScores: AssessmentScore[];

  @Prop({ default: Date.now })
  lastAccessed: Date;

  @Prop({ default: 'not-started', enum: ['not-started', 'in-progress', 'completed'] })
  completionStatus: string;

  @Prop({ default: 0 })
  overallProgress: number;
}

@Schema({ timestamps: true })
export class Certificate {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Course' })
  courseId: string;

  @Prop({ required: true })
  issueDate: Date;

  @Prop({ required: true })
  certificateNumber: string;

  @Prop()
  grade: string;
}

@Schema({ timestamps: true })
export class StudentPreferences {
  @Prop({ type: [String] })
  interests: string[];

  @Prop({ type: [String] })
  preferredLanguages: string[];

  @Prop({ default: 'light', enum: ['light', 'dark'] })
  theme: string;

  @Prop({ default: true })
  emailNotifications: boolean;
}

@Schema({ timestamps: true })
export class StudentProfile {
  @Prop()
  avatar: string;

  @Prop()
  bio: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  address: string;

  @Prop()
  education: string;

  @Prop({ type: [String] })
  skills: string[];

  @Prop()
  timezone: string;
}

@Schema({ timestamps: true })
export class Student extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [String], default: [] })
  enrolledCourses: string[];

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }], default: [] })
  progress: any[];

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }], default: [] })
  certificates: any[];

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }], default: [] })
  achievements: any[];

  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  preferences: any;

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }], default: [] })
  notifications: any[];

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }], default: [] })
  meetings: any[];

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }], default: [] })
  paymentHistory: any[];

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }], default: [] })
  subscriptions: any[];

  @Prop({ type: MongooseSchema.Types.Mixed })
  profile: StudentProfile;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
