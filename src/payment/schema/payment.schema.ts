import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema, Types, Document } from "mongoose";

@Schema({timestamps: true})
export class Payment extends Document {
    @Prop({ type: String })
    email: string;

    @Prop({ type: String })
    name: string;

    @Prop({ type: String })
    transactionId: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    userId: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    vendorId: MongooseSchema.Types.ObjectId;

    @Prop({ type: String, required: true})
    referenceId: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product' })
    productId: MongooseSchema.Types.ObjectId;

    @Prop({ type: Number, required: true })
    packagePrice: number;

    @Prop({type: String })
    resume: string;

    @Prop({type: String })
    linkedinUrl: string;

    @Prop({ type: String })
    status: string;

    @Prop({ type: String })
    workExperience: string;

    @Prop({ type: String})
    professionalSummary: string;

    @Prop({ type: String })
    education: string;

    @Prop({ type: String }) 
    skills: string;

    @Prop({ type: String, required: true})
    packageTitle: string;

    @Prop({ type: String, enum:['pending', 'completed'], default: 'pending'})
    serviceStatus: string;

    @Prop({ type: Date })
    paidAt: Date;

    @Prop({ type: String })
    currency: string;
}


export const PaymentSchema = SchemaFactory.createForClass(Payment);