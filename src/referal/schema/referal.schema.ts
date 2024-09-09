import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema, Types, Document } from "mongoose";

@Schema()
export class Referal extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Job', required: true })
  jobId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({type: String})
  referredEmail: string;

  @Prop({ type: Date, default: Date.now })
  referedAt: Date;

  @Prop({ type: String, enum: ['pending', 'processing', 'approved', 'rejected'], default: 'pending' })
  status: string;

}

export const ReferalSchema = SchemaFactory.createForClass(Referal);

