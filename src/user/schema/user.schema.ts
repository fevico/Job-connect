import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema, Types, Document } from "mongoose";


@Schema({timestamps: true})
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
  nationality: string;

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

  @Prop({ type: Boolean, default: false })
  isSubscribed: boolean;

  @Prop({ type: Date })
  subscriptionEndDate: Date;

  @Prop({type: String})
  avatar: string

  @Prop({
    type: {
      linkdinUrl: { type: String },
      currentJob: { type: String },
      keySkills: { type: String },
      yearsOfExperience: { type: String },
      industry: { type: String },
    },
  })
  linkedinProfile: {
    linkdinUrl: string;
    currentJob: string;
    keySkills: string;
    yearsOfExperience: string;
    industry: string;
  };

  @Prop({
    type: {
      optimizationGoal: { type: String },
      targetAudience: { type: String },
      profileSection: { type: String },
    },
  })
  linkedinOptimization : {
    optimizationGoal: string;
    targetAudience: string;
    profileSection: string;
  };

  @Prop({
    type: {
      resume: { type: String },
      portfolio: { type: [String] },
      yearsOfExperience: { type: String },
      Specializations: { type: String },
      Certifications: { type: String },
      Education: { type: String },
    },
  })
  professionalInformation : {
    resume: string;
    portfolio: string[];
    yearsOfExperience: string;
    specializations: string;
    bio: string;
    education: string;
  };

  @Prop({
    type: {
      availability: { type: String },
      wokHours: { type: String },
      responseTime: { type: String },
    },
  })
  workAvailability : {
    availability: string;
    wokHours: string;
    responseTime: string;
  };


  @Prop({ required: true, enum: ['admin', 'jobseeker', 'employer', 'cvwriter', 'linkdinOptimizer'], default: 'jobseeker' })
  role: string;

  @Prop({ type: Number, default: 0 })
  referalBalance: number;

  @Prop({ type: Boolean, default: false })
  suspend: boolean;

}

export const userSchema = SchemaFactory.createForClass(User);