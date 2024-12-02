import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class VideoMetadata {
  @Prop()
  duration: number;

  @Prop()
  resolution: string;

  @Prop()
  format: string;

  @Prop()
  bitrate: number;

  @Prop()
  fps: number;

  @Prop({ type: [String] })
  qualities: string[];

  @Prop()
  thumbnailUrl: string;

  @Prop({ type: [String] })
  subtitles: string[];

  @Prop({ type: Map, of: String })
  captions: Map<string, string>;
}

@Schema()
export class Transcoding {
  @Prop()
  status: string;

  @Prop()
  progress: number;

  @Prop({ type: [String] })
  formats: string[];

  @Prop({ type: [String] })
  resolutions: string[];

  @Prop()
  error: string;

  @Prop()
  startTime: Date;

  @Prop()
  endTime: Date;
}

@Schema({ timestamps: true })
export class Media extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true, enum: ['video', 'audio', 'document', 'image'] })
  type: string;

  @Prop({ required: true })
  url: string;

  @Prop()
  originalFilename: string;

  @Prop()
  mimeType: string;

  @Prop()
  size: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Course' })
  courseId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Module' })
  moduleId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, refPath: 'uploaderType' })
  uploaderId: string;

  @Prop({ enum: ['Teacher', 'Admin'] })
  uploaderType: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  videoMetadata: VideoMetadata;

  @Prop({ type: MongooseSchema.Types.Mixed })
  transcoding: Transcoding;

  @Prop({ default: 'processing', enum: ['processing', 'ready', 'failed', 'deleted'] })
  status: string;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ default: 'public', enum: ['public', 'private', 'unlisted'] })
  visibility: string;

  @Prop({ type: Map, of: String })
  versions: Map<string, string>;

  @Prop()
  processingProgress: number;

  @Prop({ type: MongooseSchema.Types.Mixed })
  analytics: {
    views: number;
    completionRate: number;
    averageWatchTime: number;
    engagementScore: number;
    [key: string]: any;
  };

  @Prop({ type: MongooseSchema.Types.Mixed })
  settings: {
    autoplay: boolean;
    loop: boolean;
    downloadable: boolean;
    [key: string]: any;
  };

  @Prop({ type: MongooseSchema.Types.Mixed })
  metadata: Record<string, any>;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const VideoMetadataSchema = SchemaFactory.createForClass(VideoMetadata);
export const TranscodingSchema = SchemaFactory.createForClass(Transcoding);
export const MediaSchema = SchemaFactory.createForClass(Media);
