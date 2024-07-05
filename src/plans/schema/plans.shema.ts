import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema, Types, Document } from "mongoose";

@Schema()
export class Plans extends Document {
  @Prop({type: String, required: true})
  planName: string;

  @Prop({ type: String, required: true })
  planDescription: string;

  @Prop({ type: Number })
  planPrice: number;

  @Prop({ type: Number, default: 0 })
  planDuration: number;

  @Prop({ type: Date, default: Date.now })
  createddAt: Date;
}

export const PlanSchema = SchemaFactory.createForClass(Plans);
