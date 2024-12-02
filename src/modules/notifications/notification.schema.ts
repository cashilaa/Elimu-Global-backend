import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true, enum: ['info', 'success', 'warning', 'error'] })
  type: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, refPath: 'recipientType' })
  recipient: string;

  @Prop({ required: true, enum: ['Student', 'Teacher', 'Admin'] })
  recipientType: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Course' })
  courseId: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  metadata: Record<string, any>;

  @Prop({ default: false })
  read: boolean;

  @Prop({ default: false })
  archived: boolean;

  @Prop({ required: true, enum: [
    'course_update',
    'assessment',
    'announcement',
    'deadline',
    'grade',
    'enrollment',
    'message',
    'system'
  ]})
  category: string;

  @Prop({ default: 'normal', enum: ['low', 'normal', 'high', 'urgent'] })
  priority: string;

  @Prop()
  actionUrl: string;

  @Prop({ default: Date.now })
  expiresAt: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
