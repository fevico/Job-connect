import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema, Types, Document } from "mongoose";

@Schema()
export class Payment extends Document {
    @Prop({type: String})
    email: string;

    @Prop({type: String})
    name: string;

    @Prop({type: String})
    transactionId: string;

    @Prop({type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    userId: MongooseSchema.Types.ObjectId;

    @Prop({type: String})
    referenceId: string;

    @Prop({type: MongooseSchema.Types.ObjectId, ref: 'Product' })
    productId: MongooseSchema.Types.ObjectId;

    @Prop({type: Number})
    totalAmount: number;

    @Prop({type: String})
    status: string;

    @Prop({type: String})
    currency: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);