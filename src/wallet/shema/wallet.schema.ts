import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema, Types, Document } from "mongoose";

@Schema()
export class Wallet extends Document {
    @Prop({type: Number, default: 0})
    balance: number;

    @Prop({type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    owner: MongooseSchema.Types.ObjectId;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);