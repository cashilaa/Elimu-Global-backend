import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Badge {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  imageUrl: string;

  @Prop({ required: true })
  points: number;

  @Prop({ required: true, enum: ['bronze', 'silver', 'gold', 'platinum', 'special'] })
  tier: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  criteria: {
    type: string;
    requirement: number;
    [key: string]: any;
  };

  @Prop({ default: true })
  isActive: boolean;
}

@Schema()
export class Achievement {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  imageUrl: string;

  @Prop({ required: true })
  points: number;

  @Prop({ required: true, enum: ['course', 'assessment', 'engagement', 'special'] })
  category: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  criteria: {
    type: string;
    requirement: number;
    courseId?: string;
    [key: string]: any;
  };

  @Prop({ default: true })
  isActive: boolean;
}

@Schema()
export class StudentProgress {
  @Prop({ required: true })
  currentPoints: number;

  @Prop({ required: true })
  level: number;

  @Prop({ required: true })
  pointsToNextLevel: number;

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }] })
  earnedBadges: {
    badgeId: string;
    earnedAt: Date;
    [key: string]: any;
  }[];

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }] })
  earnedAchievements: {
    achievementId: string;
    earnedAt: Date;
    [key: string]: any;
  }[];

  @Prop({ type: Map, of: Number })
  categoryProgress: Map<string, number>;
}

@Schema({ timestamps: true })
export class Gamification extends Document {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Student' })
  studentId: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  progress: StudentProgress;

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }] })
  badges: Badge[];

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }] })
  achievements: Achievement[];

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }] })
  recentActivities: {
    type: string;
    points: number;
    description: string;
    timestamp: Date;
    metadata?: Record<string, any>;
  }[];

  @Prop({ type: MongooseSchema.Types.Mixed })
  stats: {
    totalPoints: number;
    totalBadges: number;
    totalAchievements: number;
    highestStreak: number;
    currentStreak: number;
    [key: string]: any;
  };

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }] })
  rewards: {
    type: string;
    value: string;
    expiryDate?: Date;
    isRedeemed: boolean;
    redeemedAt?: Date;
    [key: string]: any;
  }[];

  @Prop({ type: MongooseSchema.Types.Mixed })
  settings: {
    notificationsEnabled: boolean;
    displayBadges: boolean;
    displayLevel: boolean;
    [key: string]: any;
  };

  @Prop({ type: MongooseSchema.Types.Mixed })
  metadata: Record<string, any>;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const BadgeSchema = SchemaFactory.createForClass(Badge);
export const AchievementSchema = SchemaFactory.createForClass(Achievement);
export const StudentProgressSchema = SchemaFactory.createForClass(StudentProgress);
export const GamificationSchema = SchemaFactory.createForClass(Gamification);
