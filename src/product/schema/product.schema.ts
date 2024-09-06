import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema, Types, Document } from "mongoose";

@Schema()
export class Product extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
    userId: MongooseSchema.Types.ObjectId;

    @Prop({ type: String, required: true })
    timeFrame: string;

    @Prop({ type: Number, required: true })
    price: number;

    @Prop({ type: String, required: true })
    title: string;

    @Prop({ type: String, required: true })
    description: string;

    @Prop({ type: String })
    type?: string; // Indicate that this field is optional in TypeScript

    @Prop({ type: [String], required: true })
    images: string[]; // Expecting multiple image URLs
}

export const ProductSchema = SchemaFactory.createForClass(Product);
