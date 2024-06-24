import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {  Schema as MongooseSchema, Types } from "mongoose";

@Schema()
export class Job {
  @Prop({type: String, required: true})
  title: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'Category' }) // Specify ref option
  categoryId: MongooseSchema.Types.ObjectId;
  
  @Prop({
    type: {
      state: { type: String, required: true },
      country: { type: String, required: true },
    },
    required: true, 
  })
  location: { state: string; country: string };

  @Prop({type: [String]})
  skills: string[];

  @Prop({type: Number})
  price: number;

  @Prop({type: String})
  duration: string;

  @Prop()
  description: string;

  @Prop({type: MongooseSchema.Types.ObjectId, ref: 'User'})
  userId: MongooseSchema.Types.ObjectId;

  @Prop({type:String, enum: ['active', 'closed', 'expired'], default: 'active'})
  status: string
}

export const JobSchema = SchemaFactory.createForClass(Job);