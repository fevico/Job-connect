import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema, Types, Document } from "mongoose";


@Schema({timestamps: true})
export class SubscriptionPayment {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Subscription', required: true })
  subscriptionId: string;

  @Prop({ type: String, required: true })
  transactionId: string;  // From the payment provider

  @Prop({ type: String, required: true })
  companyName: string;  // From the payment provider

  @Prop({ type: String, required: true })
  email: string;  // From the payment provider

  @Prop({ type: String })
  plan: string; // E.g., "monthly", "yearly"

  @Prop({ type: Date, required: true })
  paymentDate: Date;

  @Prop({ type: String, required: true })
  status: string; // E.g., "success", "failed", etc.

  @Prop({ type: Number, required: true })
  amount: number;
}

export const SubscriptionPaymentSchema = SchemaFactory.createForClass(SubscriptionPayment);
