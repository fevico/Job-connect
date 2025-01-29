import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({timestamps: true})
export class Job extends Document {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: 'Category',
  }) // Specify ref option
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

  @Prop({ type: Number, required: false })
  priceFrom: number;

  @Prop({ type: Number, required: false })
  priceTo: number;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String })
  companyName: string;

  @Prop({ type: Boolean, default: false })
  isFeatured: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({type: Date, default: Date.now })
  postedAt: Date; // When the job was posted

  @Prop({ type: Date })
  expiresAt: Date; // When the job will expire (based on visibility days)

  @Prop({ type: String, enum: ['active', 'closed'], default: 'active' })
  status: string;

  @Prop({ type: String })
  aboutCompany: string;

  @Prop({ type: String, enum: ['yes', 'no'], default: 'no' })
  referral: string;

  @Prop({ type: String, required: false})
  currency: string;
  
  @Prop({ type: String, required: true})
  industry: string;

  @Prop({ type: Number, default: 0 })
  referralAmount: number;

  @Prop({ type: String })
  slug: string;
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
