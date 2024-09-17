import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema, Types, Document } from "mongoose";

@Schema({ timestamps: true })
export class Wallet extends Document {
    @Prop({
        type: Number,
        default: 0,
        validate: {
            validator: (value: number) => !isNaN(value), // Ensure the value is not NaN
            message: 'Balance must be a valid number',
        },
    })
    balance: number;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    owner: MongooseSchema.Types.ObjectId;

    @Prop({ type: Number, default: 0 })
    totalSales: number;

    @Prop({ type: Number, default: 0 })
    rollOut: number;

    // Transactions array defined inline
    @Prop({
        type: [
            {
                amount: { type: Number, required: true },
                totalAmount: { type: Number, default: 0 },
                date: { type: Date, default: Date.now }, // Automatically set date when transaction is created
            }, 
        ],
        default: [], // Default to an empty array if no transactions exist
    })
    transactions: {
        amount: number;
        totalAmount: number;
        date: Date;
    }[];
}

// Create the schema for Wallet
export const WalletSchema = SchemaFactory.createForClass(Wallet);
