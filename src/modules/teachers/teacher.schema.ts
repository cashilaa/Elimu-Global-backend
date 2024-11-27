import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Teacher extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: [] })
  courses: string[];

  @Prop()
  specialization: string[];

  @Prop()
  bio: string;

  @Prop()
  qualification: string[];

  @Prop({ default: 'active', enum: ['active', 'inactive', 'suspended'] })
  status: string;

  @Prop()
  phoneNumber: string;

  @Prop({ default: 0 })
  rating: number;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
