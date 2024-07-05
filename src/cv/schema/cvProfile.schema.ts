import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema, Types, Document } from "mongoose";


@Schema()
export class CvProfile extends Document {
    @Prop({type: MongooseSchema.Types.ObjectId, ref: "User" })
    userId: MongooseSchema.Types.ObjectId;

    @Prop({type: MongooseSchema.Types.ObjectId, ref: "Profile" })
    profileId: MongooseSchema.Types.ObjectId;

    @Prop({type: String, required: true})
    linkdinUrl: string

    @Prop({type: [String], required: true})
    portfolio: string[]

    @Prop({type: Number, required: true})
    price: number
}

export const CvProfileSchema = SchemaFactory.createForClass(CvProfile); // 1