import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema } from 'mongoose';


@Schema()
export class Profile {
  @Prop({type: String, required: true})
  firstName: string;

  @Prop({type: String, required: true})
  lastName: string;

  @Prop({type: Date})
  dateOfBirth: Date;
  
  @Prop({type: String})
  gender: string;
  
  @Prop({type: String, required: true})
  phoneNumber: string;

  @Prop({type: String, required: true})
  nationality: string;

  @Prop({type: String, required: true})
  state: string;

  @Prop({type: String})
  companyName: string;

  @Prop({type: String})
  industry: string;

  @Prop({type: String})
  companyUrl: string;

  @Prop({type: String})
  companyDescription: string;

  @Prop({type: String})
  companyAddress: string;

  @Prop({type: String})
  jobTitle: string;

  @Prop({type: String})
  bio: string;

  @Prop({type: String})
  profilePicture: string;

  @Prop({type: String})
  yearsOfExperience: string;

  @Prop({type: [String]})
  skills: string[];

  @Prop({type: String})
  city: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User" })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: {
      jobTitle: { type: String},
      companyName: { type: String },
      location: { type: String },
      startDate: { type: Date},
      endDate: { type: Date},
      resposnsibility: { type: String},
    },
  })
  workExperience: {
    jobTitle: string;
    companyName: string;
    location: string;
    startDate: Date;
    endDate: Date;
    resposnsibility: string;
  };

  @Prop({
    type: {
      jobPosition: { type: String },
      careerObjective: { type: String },
      skills: [{ type: String }],
    },
  })
  professionalInformation: {
    jobPosition: string;
    careerObjective: string;
    skills: string[];
  };

  @Prop({
    type: {
      degreeName: { type: String },
      institutionName: { type: String },
      location: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
    },
  })
  educationalBackground: {
    degreeName: string;
    institutionName: string;
    location: string;
    startDate: Date;
    endDate: Date;
  };

  @Prop({
    type: {
      jobType: [{ type: String}],
      relocate: { type: String},
      workLocation: { type: String},
      salary: { type: Date },
    },
  
  })
  preferences: {
    jobType: [string];
    relocate: string;
    workLocation: string;
    salary: string;
  };

  // @Prop({
  //   type: {
  //     jobCategory: { type: String, required: true },
  //     relocate: { type: String, required: true },
  //     workLocation: { type: String, required: true },
  //     salary: { type: Date, required: true },
  //   },
  
  // })
  // hiringPreferences: {
  //   jobType: [string];
  //   relocate: string;
  //   workLocation: string;
  //   salary: string;
  // };

  @Prop({type: String})
  CV: string

}

export const ProfileSchema = SchemaFactory.createForClass(Profile);