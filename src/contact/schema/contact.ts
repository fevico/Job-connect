import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema, Types, Document } from "mongoose";

@Schema({timestamps: true})
export class Contact extends Document {

  @Prop({type: String, required: true})
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: String, required: true })
  message: string;

  @Prop({ type: String, enum: ['pending', 'processing', 'success'], default: 'pending' })
  status: string;

}

export const ContactSchema = SchemaFactory.createForClass(Contact);

