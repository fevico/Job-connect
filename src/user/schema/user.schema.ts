import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User {
  @Prop({type: String, required: true})
  name: string;

  @Prop({type: String, required: true, unique: true})
  email: string;

  @Prop({type: String})
  companyName: string;

  @Prop({type: String})
  companyAddress: string;

  @Prop({type: String})
  companyDescription: string;

  @Prop({type: String})
  gender: string;

  @Prop({type: String})
  nationlity: string;

  @Prop({type: String})
  location: string;

  @Prop({type: String, required: true})
  phone: string;

  @Prop({type: String})
  qualification: string;

  @Prop({type: Number})
  yearsOfExperience: number;

  @Prop({type: String})
  Cv: string;

  @Prop({type: Boolean, default: false})
  isVerified: boolean;

  @Prop({type: [String]})
  skills: string[];

  @Prop({type: String, required: true})
  password: string;

  @Prop({type: Boolean, default: false})
  isActive: boolean

  @Prop({ required: true, enum: ['admin', 'jobseeker', 'employer', 'cvwriter', 'linkdinOptimizer'], default: 'jobseeker' })
  role: string;

  @Prop({ type: Number, default: 0 })
  referalBalance: number;

}

export const userSchema = SchemaFactory.createForClass(User);