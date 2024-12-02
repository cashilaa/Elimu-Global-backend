import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Certificate extends Document {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Student' })
  studentId: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Course' })
  courseId: string;

  @Prop({ required: true })
  certificateNumber: string;

  @Prop({ required: true })
  issueDate: Date;

  @Prop()
  expiryDate: Date;

  @Prop({ required: true })
  studentName: string;

  @Prop({ required: true })
  courseName: string;

  @Prop({ required: true })
  instructorName: string;

  @Prop()
  grade: string;

  @Prop()
  completionDate: Date;

  @Prop()
  hoursCompleted: number;

  @Prop({ type: [String] })
  skills: string[];

  @Prop()
  certificateTemplate: string;

  @Prop()
  signatureImage: string;

  @Prop()
  logoImage: string;

  @Prop({ type: Map, of: String })
  customFields: Map<string, string>;

  @Prop({ default: true })
  isValid: boolean;

  @Prop()
  verificationUrl: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  metadata: Record<string, any>;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const CertificateSchema = SchemaFactory.createForClass(Certificate);
