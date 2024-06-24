import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Category {
  @Prop()
  name: string;

  @Prop({type: Date, default: Date.now()})
  createdAt: Date;
}
 
export const CategorySchema = SchemaFactory.createForClass(Category);