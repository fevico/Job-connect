import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema } from 'mongoose';


@Schema()
export class Profile {
  @Prop({type: String, required: true})
  firstName: string;

  @Prop({type: String, required: true})
  lastName: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User" })
  userId: MongooseSchema.Types.ObjectId;

  
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);