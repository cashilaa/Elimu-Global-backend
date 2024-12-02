import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, refPath: 'authorType' })
  authorId: string;

  @Prop({ required: true, enum: ['Student', 'Teacher'] })
  authorType: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId }], ref: 'Comment' })
  replies: string[];

  @Prop({ type: [String] })
  attachments: string[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId }], refPath: 'likedByType' })
  likedBy: string[];

  @Prop({ type: [String] })
  likedByType: string[];

  @Prop({ default: false })
  isEdited: boolean;

  @Prop({ default: false })
  isPinned: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

@Schema({ timestamps: true })
export class Discussion extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Course' })
  courseId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Module' })
  moduleId: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, refPath: 'authorType' })
  authorId: string;

  @Prop({ required: true, enum: ['Student', 'Teacher'] })
  authorType: string;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ type: [String] })
  attachments: string[];

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }] })
  comments: Comment[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId }], refPath: 'likedByType' })
  likedBy: string[];

  @Prop({ type: [String] })
  likedByType: string[];

  @Prop({ default: 'open', enum: ['open', 'closed', 'resolved'] })
  status: string;

  @Prop({ default: false })
  isAnnouncement: boolean;

  @Prop({ default: false })
  isPinned: boolean;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId }], refPath: 'followersType' })
  followers: string[];

  @Prop({ type: [String] })
  followersType: string[];

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ type: MongooseSchema.Types.Mixed })
  metadata: Record<string, any>;

  @Prop({ default: Date.now })
  lastActivity: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
export const DiscussionSchema = SchemaFactory.createForClass(Discussion);
