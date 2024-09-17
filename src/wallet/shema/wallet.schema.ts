import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema, Types, Document } from "mongoose";

@Schema({ timestamps: true })
export class Wallet extends Document {
    @Prop({
        type: Number,
        default: 0,
        validate: {
            validator: (value: number) => !isNaN(value), // Ensure the value is not NaN
            message: 'Balance must be a valid number'
        }
    })
    balance: number;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    owner: MongooseSchema.Types.ObjectId;

    @Prop({type: Number, default: 0})
    adminBalance: number;

    @Prop({type: Number, default: 0})
    totalSales: number;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
