import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class PricingPlan {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ required: true, enum: ['monthly', 'yearly', 'lifetime', 'one-time'] })
  billingCycle: string;

  @Prop({ type: [String] })
  features: string[];

  @Prop()
  trialDays: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: MongooseSchema.Types.Mixed })
  metadata: Record<string, any>;
}

@Schema()
export class Subscription {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Student' })
  studentId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Course' })
  courseId: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  plan: PricingPlan;

  @Prop({ required: true })
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ default: 'active', enum: ['active', 'cancelled', 'expired', 'trial'] })
  status: string;

  @Prop()
  cancelledAt: Date;

  @Prop({ default: true })
  autoRenew: boolean;

  @Prop({ type: MongooseSchema.Types.Mixed })
  metadata: Record<string, any>;
}

@Schema({ timestamps: true })
export class Payment extends Document {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Student' })
  studentId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Course' })
  courseId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Subscription' })
  subscriptionId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ required: true, enum: ['course-purchase', 'subscription', 'plan-upgrade'] })
  type: string;

  @Prop({ required: true, enum: ['pending', 'completed', 'failed', 'refunded'] })
  status: string;

  @Prop({ required: true })
  paymentMethod: string;

  @Prop()
  transactionId: string;

  @Prop()
  invoiceUrl: string;

  @Prop()
  receiptUrl: string;

  @Prop()
  refundAmount: number;

  @Prop()
  refundReason: string;

  @Prop()
  refundedAt: Date;

  @Prop({ type: MongooseSchema.Types.Mixed })
  paymentDetails: {
    cardLast4?: string;
    cardBrand?: string;
    bankName?: string;
    [key: string]: any;
  };

  @Prop({ type: MongooseSchema.Types.Mixed })
  billingAddress: {
    name?: string;
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    [key: string]: any;
  };

  @Prop({ type: MongooseSchema.Types.Mixed })
  metadata: Record<string, any>;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const PricingPlanSchema = SchemaFactory.createForClass(PricingPlan);
export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
export const PaymentSchema = SchemaFactory.createForClass(Payment);
