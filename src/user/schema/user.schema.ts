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

  @Prop({type: String, required: true})
  password: string;

  @Prop({type: Boolean, default: false})
  isActive: boolean

  @Prop({ required: true, enum: ['admin', 'jobseeker', 'employer', 'cvwriter', 'linkdinOptimizer'], default: 'jobseeker' })
  role: string;

  @Prop({ type: Number, default: 0 })
  referalBalance: number;


  // @Prop()
  // dateOfBirth: string;

  // @Prop()
  // phoneNumber: string;

  // @Prop()
  // gender: string;

  // @Prop()
  // country: string;

  // @Prop()
  // stateOfResidence: string;

  // @Prop()
  // city: string;

  // @Prop()
  // password: string;
  
  // @Prop()
  // jobPosition: string;
  
  // @Prop()
  // carrerObjective: string;
  
  // @Prop({ type: [String] })
  // skills: string[];

  // // Work experience
   
  // @Prop()
  // jobTitle: string;

  // @Prop()
  // companyName: string;

  // @Prop()
  // loacation: string;

  // @Prop()
  // startDate: Date;

  // @Prop()
  // endDate: Date;

  // @Prop()
  // responsibilities: string;

  // Education Background
  // @Prop()
  // nameOfDegree: string;

  // @Prop()
  // nameOfInstitution: string;
 
  // @Prop()
  // from: Date;

  // @Prop()
  // to: Date;

  // // Prefernce 
  // @Prop({ type: [String] })
  // jobType: string[];

  // @Prop()
  // relocate: string;

  // @Prop()
  // preferedLocation: string;

  // @Prop()
  // expectedSalary: string;

  // @Prop()
  // resumeUrl?: string;
}

export const userSchema = SchemaFactory.createForClass(User);