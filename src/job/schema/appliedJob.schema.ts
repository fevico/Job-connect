import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema, Types, Document } from "mongoose";

@Schema()
export class AppliedJob extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Job', required: true })
  jobId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, required: true})
  resume: string;

  @Prop({ type: String, required: true })
  userEmail: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Date, default: Date.now })
  appliedAt: Date;

  @Prop({ type: String, enum: ['applied', 'reviewed', 'interview', 'hired', 'rejected'], default: 'applied' })
  status: string; 

  @Prop({ type: String })
  jobTitle: string;

  @Prop({ type: String })
  companyName: string;
}

export const AppliedJobSchema = SchemaFactory.createForClass(AppliedJob);

// Create a composite unique index on jobId and userId
AppliedJobSchema.index({ jobId: 1, userId: 1 }, { unique: true });
