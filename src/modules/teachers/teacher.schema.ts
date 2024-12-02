import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class TeacherAnalytics {
  @Prop({ default: 0 })
  totalStudents: number;

  @Prop({ default: 0 })
  totalCourses: number;

  @Prop({ default: 0 })
  averageRating: number;

  @Prop({ type: Map, of: Number, default: {} })
  studentEngagement: Map<string, number>;

  @Prop({ type: Map, of: Number, default: {} })
  courseCompletionRates: Map<string, number>;

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }] })
  monthlyStats: any[];
}

@Schema({ timestamps: true })
export class TeacherSchedule {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ required: true, enum: ['class', 'meeting', 'office-hours', 'other'] })
  type: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Course' })
  courseId: string;

  @Prop()
  description: string;

  @Prop({ type: [String] })
  attendees: string[];

  @Prop()
  zoomLink: string;
}

@Schema({ timestamps: true })
export class TeacherProfile {
  @Prop()
  avatar: string;

  @Prop()
  coverImage: string;

  @Prop()
  bio: string;

  @Prop({ type: [String] })
  specialization: string[];

  @Prop({ type: [String] })
  qualification: string[];

  @Prop({ type: [String] })
  certifications: string[];

  @Prop()
  website: string;

  @Prop({ type: Map, of: String })
  socialLinks: Map<string, string>;

  @Prop()
  timezone: string;

  @Prop({ type: [String] })
  languages: string[];

  @Prop()
  teachingStyle: string;
}

@Schema({ timestamps: true })
export class TeacherSettings {
  @Prop({ default: true })
  emailNotifications: boolean;

  @Prop({ default: 'light', enum: ['light', 'dark'] })
  theme: string;

  @Prop({ default: true })
  showProfile: boolean;

  @Prop({ type: [String], default: ['email'] })
  communicationPreferences: string[];

  @Prop({ default: 'en' })
  language: string;
}

@Schema({ timestamps: true })
export class Teacher extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId }], ref: 'Course' })
  courses: string[];

  @Prop({ type: MongooseSchema.Types.Mixed })
  profile: TeacherProfile;

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }] })
  schedule: TeacherSchedule[];

  @Prop({ type: MongooseSchema.Types.Mixed })
  analytics: TeacherAnalytics;

  @Prop({ type: MongooseSchema.Types.Mixed })
  settings: TeacherSettings;

  @Prop({ default: 'active', enum: ['active', 'inactive', 'suspended'] })
  status: string;

  @Prop()
  phoneNumber: string;

  @Prop({ default: 0, min: 0, max: 5 })
  rating: number;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId }], ref: 'Student' })
  students: string[];

  @Prop({ default: Date.now })
  lastActive: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
