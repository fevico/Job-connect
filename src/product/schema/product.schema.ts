import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema, Types, Document } from "mongoose";

@Schema()
export class Product extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
    userId: MongooseSchema.Types.ObjectId;

    @Prop({ type: Number, required: true })
    price: number;

    @Prop({ type: String, required: true })
    title: string;

    @Prop({ type: String, required: true })
    description: string;

    @Prop({ type: String })
    type?: string; // Optional type field

    @Prop({ type: [String], required: true })
    images: string[]; // Expecting multiple image URLs

    // New field to store individual ratings
    
    @Prop([{ 
        userId: { type: MongooseSchema.Types.ObjectId, ref: "User" }, 
        rating: { type: Number, min: 1, max: 5 } 
    }])
    ratings: { userId: Types.ObjectId, rating: number }[];
    

    // Field to store average rating
    @Prop({ type: Number, default: 0 })
    averageRating: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
