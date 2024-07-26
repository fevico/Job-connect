import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SubscriptionDocument = Subscription & Document;

@Schema()
export class Subscription {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ type: Number })
  planPrice: number;

  @Prop({ type: Number, default: 0 })
  planDuration: number;

  @Prop({ required: true, enum: ['active', 'inactive', 'cancelled'], default: 'inactive' })
  status: string;

  @Prop({ type: Date, default: Date.now })
  createddAt: Date;

  @Prop({ required: true, default: false })
  autoRenew: boolean;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
