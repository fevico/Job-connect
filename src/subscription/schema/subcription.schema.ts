import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


export type SubscriptionDocument = Subscription & Document;

@Schema({timestamps: true})
export class Subscription {
  @Prop({ required: true })
  name: string; // Basic, Standard, Premium

  @Prop({ required: true, enum: ['basic', 'standard', 'premium'] })
  type: string; // basic, standard, premium

  @Prop({type: Number, required: true })
  price: number; // Price for the plan

  @Prop({type: String, required: true })
  description: string; // Price for the plan

  @Prop({ required: true })
  maxJobs: number; // Maximum number of jobs allowed for the plan

  @Prop({ required: true })
  jobVisibilityDays: number; // Number of days a job is visible

  @Prop({ default: Date.now })
  createdAt: Date; // Creation date of the plan
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
