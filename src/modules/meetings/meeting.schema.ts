import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class ZoomConfig {
  @Prop()
  meetingId: string;

  @Prop()
  password: string;

  @Prop()
  joinUrl: string;

  @Prop()
  startUrl: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  settings: {
    waitingRoom?: boolean;
    participantVideo?: boolean;
    hostVideo?: boolean;
    muteUponEntry?: boolean;
    autoRecording?: string;
    [key: string]: any;
  };
}

@Schema()
export class Participant {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, refPath: 'participantType' })
  userId: string;

  @Prop({ required: true, enum: ['Student', 'Teacher'] })
  participantType: string;

  @Prop({ default: 'pending', enum: ['pending', 'accepted', 'declined', 'attended'] })
  status: string;

  @Prop()
  joinTime: Date;

  @Prop()
  leaveTime: Date;

  @Prop({ default: false })
  isHost: boolean;

  @Prop({ default: false })
  isCoHost: boolean;
}

@Schema({ timestamps: true })
export class Meeting extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Course' })
  courseId: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Teacher' })
  hostId: string;

  @Prop({ required: true, enum: ['webinar', 'lecture', 'office-hours', 'group-discussion'] })
  type: string;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ default: 'scheduled', enum: ['scheduled', 'live', 'completed', 'cancelled'] })
  status: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  zoomConfig: ZoomConfig;

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }] })
  participants: Participant[];

  @Prop({ type: [String] })
  resources: string[];

  @Prop()
  recordingUrl: string;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ default: false })
  isRecurring: boolean;

  @Prop()
  recurrencePattern: string;

  @Prop()
  timezone: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  reminders: {
    email?: boolean;
    notification?: boolean;
    timing: number[];
  };

  @Prop({ type: MongooseSchema.Types.Mixed })
  settings: {
    requireRegistration?: boolean;
    maxParticipants?: number;
    allowChat?: boolean;
    allowRecording?: boolean;
    [key: string]: any;
  };

  @Prop({ type: MongooseSchema.Types.Mixed })
  statistics: {
    totalParticipants?: number;
    averageAttendanceTime?: number;
    peakParticipants?: number;
    [key: string]: any;
  };

  @Prop({ type: MongooseSchema.Types.Mixed })
  metadata: Record<string, any>;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ZoomConfigSchema = SchemaFactory.createForClass(ZoomConfig);
export const ParticipantSchema = SchemaFactory.createForClass(Participant);
export const MeetingSchema = SchemaFactory.createForClass(Meeting);
