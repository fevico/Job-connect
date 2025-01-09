import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema, Types, Document } from "mongoose";
import { Subscription } from './subcription.schema'; 


export type SubscriptionDocument = Subscription & Document;

@Schema({timestamps: true})

export class SubscriptionPayment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId; // Reference to the user

  @Prop({ required: true })
  planName: string; // Basic, Standard, Premium

  @Prop({ type: String, required: false })
  transactionId: string;  // From the payment provider

  @Prop({ type: String, required: false })
  companyName: string;  // From the payment provider

  @Prop({ type: String, required: false })
  email: string;  // From the payment provider

  @Prop({ type: Date, required: false })
  paymentDate: Date;

  @Prop({type: Number, default: 0})
  freeJobCount: number;

  @Prop({type: Number, default: 0})
  freeJobLimit: number;

  @Prop({ type: String, enum:['active', 'inactive' ,'expired'], default: 'active', required: true })
  status: string; // E.g., "success", "failed", etc.

  @Prop({ type: String, required: false })
  paymentStatus: string; // E.g., "success", "failed", etc.

  @Prop({type: Number, default: 0})
  paidJobLimit: number; // Number of jobs allowed for the subscribed plan

  @Prop({type: Number, required: false })
  amountPaid: number; // Amount paid for the subscription

  @Prop({ type: Date })
  startDate: Date; // Date when the plan was activated

  @Prop({type: Date })
  endDate: Date; // Date when the plan will expire

  @Prop({ default: Date.now })
  createdAt: Date; // Subscription creation date
}

export const SubscriptionPaymentSchema = SchemaFactory.createForClass(SubscriptionPayment);

