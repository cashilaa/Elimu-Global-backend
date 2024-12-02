import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class CourseAnalytics {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Course' })
  courseId: string;

  @Prop({ default: 0 })
  totalEnrollments: number;

  @Prop({ default: 0 })
  activeStudents: number;

  @Prop({ default: 0 })
  completionRate: number;

  @Prop({ default: 0 })
  averageRating: number;

  @Prop({ type: Map, of: Number })
  moduleCompletionRates: Map<string, number>;

  @Prop({ type: Map, of: Number })
  assessmentPerformance: Map<string, number>;

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }] })
  studentProgress: any[];
}

@Schema({ timestamps: true })
export class PlatformAnalytics {
  @Prop({ default: 0 })
  totalUsers: number;

  @Prop({ default: 0 })
  activeUsers: number;

  @Prop({ default: 0 })
  totalCourses: number;

  @Prop({ default: 0 })
  totalInstructors: number;

  @Prop({ default: 0 })
  totalStudents: number;

  @Prop({ type: Map, of: Number })
  courseCategories: Map<string, number>;

  @Prop({ type: Map, of: Number })
  userGrowth: Map<string, number>;

  @Prop({ type: Map, of: Number })
  revenue: Map<string, number>;

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }] })
  monthlyStats: any[];
}

@Schema({ timestamps: true })
export class UserEngagement {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, refPath: 'userType' })
  userId: string;

  @Prop({ required: true, enum: ['Student', 'Teacher'] })
  userType: string;

  @Prop({ default: 0 })
  totalTimeSpent: number;

  @Prop({ default: 0 })
  totalActions: number;

  @Prop({ type: Map, of: Number })
  activityBreakdown: Map<string, number>;

  @Prop({ type: [Date] })
  loginHistory: Date[];

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }] })
  courseInteractions: any[];
}

@Schema({ timestamps: true })
export class Analytics extends Document {
  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }] })
  courseAnalytics: CourseAnalytics[];

  @Prop({ type: MongooseSchema.Types.Mixed })
  platformAnalytics: PlatformAnalytics;

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }] })
  userEngagement: UserEngagement[];

  @Prop({ type: Map, of: MongooseSchema.Types.Mixed })
  customMetrics: Map<string, any>;

  @Prop({ default: Date.now })
  lastUpdated: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const AnalyticsSchema = SchemaFactory.createForClass(Analytics);
