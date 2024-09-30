
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema, Document } from "mongoose";

// Base User Schema (common fields)
// User Schema and its discriminators

// Base User Schema (common fields)
@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String })
  phone: string;

  @Prop({ type: String })
  avatar: string;

  @Prop({ type: String })
  country: string;

  @Prop({ type: String })
  state: string;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ type: Boolean, default: false })
  suspended: boolean;

  // Role field
  @Prop({
    required: true,
    enum: ['jobSeeker', 'employer', 'admin', 'cvWriter', 'linkedinOptimizer', 'jobPoster'],
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Discriminator for JobSeeker
export const JobSeekerSchema = UserSchema.discriminator(
  'JobSeeker',
  new MongooseSchema({
    skills: { type: [String] },
    yearsOfExperience: { type: Number },
    qualification: { type: String },
    cv: { type: String },
    referralBalance: { type: Number, default: 0 },
  })
);

// Discriminator for Employer
export const EmployerSchema = UserSchema.discriminator(
  'Employer',
  new MongooseSchema({
    companyName: { type: String },
    companyAddress: { type: String },
    companyDescription: { type: String },
    industry: { type: String },
    numberOfEmployees: { type: Number },
    companyLogo: { type: String },
    employerType: { type: String },
    website: { type: String },
    registrationNumber: { type: String },
    registrationImage: { type: String },
    isApproved: { type: Boolean, default: false },
  })
);

// Discriminator for CvWriter
export const CvWriterSchema = UserSchema.discriminator(
  'CvWriter',
  new MongooseSchema({
    portfolio: { type: String },
    yearsOfExperience: { type: Number },
    specialization: { type: String },
    bio: { type: String },
    education: { type: String },
    workHours: { type: String },
    responseTime: { type: String },
    isApproved: { type: Boolean, default: false },
  })
);

// Discriminator for LinkedinOptimizer
export const LinkedinOptimizerSchema = UserSchema.discriminator(
  'LinkedinOptimizer',
  new MongooseSchema({
    linkedinProfile: { type: String },
    currentJob: { type: String },
    industry: { type: String },
    yearsOfExperience: { type: Number },
    skills: { type: String },
    optimizationGoal: { type: String },
    targetAudience: { type: String },
    optimizeSections: { type: String },
    workHours: { type: String },
    responseTime: { type: String },
    isApproved: { type: Boolean, default: false },
  })
);

// INTERFACES
export interface JobSeeker extends User {
  skills: string[];
  yearsOfExperience: number;
  qualification: string;
  cv: string;
  referralBalance: number;
}

export interface Employer extends User {
  companyName: string;
  companyAddress: string;
  companyDescription: string;
  industry: string;
  numberOfEmployees: number;
  companyLogo: string;
  employerType: string;
  website: string;
  registrationNumber: string;
  registrationImage: string;
  isApproved: boolean;
}

export interface CvWriter extends User {
  portfolio: string;
  yearsOfExperience: number;
  specialization: string;
  bio: string;
  education: string;
  workHours: string;
  responseTime: string;
  isApproved: boolean;
}

export interface LinkedinOptimizer extends User {
  linkedinProfile: string;
  currentJob: string;
  industry: string;
  yearsOfExperience: number;
  skills: string;
  optimizationGoal: string;
  targetAudience: string;
  optimizeSections: string;
  workHours: string;
  responseTime: string;
  isApproved: boolean;
}
