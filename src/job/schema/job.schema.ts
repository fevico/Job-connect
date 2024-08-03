import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

@Schema()
export class Job extends Document {
  @Prop({type: MongooseSchema.Types.ObjectId})
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'Category' }) // Specify ref option
  categoryId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: {
      state: { type: String, required: true },
      country: { type: String, required: true },
    },
    required: true,
  })
  location: { state: string; country: string };

  @Prop({ type: String, required: true })
  skills: string;

  @Prop({ type: Number })
  priceFrom: number;

  @Prop({ type: Number })
  priceTo: number;

  @Prop({ type: String })
  duration: string;

  @Prop({type: String})
  description: string;

  @Prop({type: String})
  companyName: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, enum: ['active', 'closed', 'expired'], default: 'active' })
  status: string;

  @Prop({ type: String, enum: ['yes', 'no'], default: 'no' })
  referal: string;

  @Prop({ type: Number, default: 0}) 
  referalAmount: number;

  @Prop({ type: String })
  slug: string;

  @Prop({ type: Date, default: Date.now() })
  postedAt: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);

// Generate slug from title
JobSchema.pre<Job>('save', function (next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = this.title
      .toLowerCase()
      .replace(/ /g, '_')
      .replace(/[^\w-]+/g, ''); // Replace spaces with _ and remove non-word characters
  }
  next();
});
