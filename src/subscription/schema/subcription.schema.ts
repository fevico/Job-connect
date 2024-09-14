import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SubscriptionDocument = Subscription & Document;

@Schema()
export class Subscription {
  @Prop({type: String, enum:['monthly', 'yearly'], default: "monthly", required: true })
  plan: string;

  @Prop({ type: Number })
  planPrice: number;

  @Prop({ required: true, enum: ['active', 'inactive', 'cancelled'], default: 'inactive' })
  status: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: false })
  autoRenew: boolean;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
