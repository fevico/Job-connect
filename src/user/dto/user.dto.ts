import { IsEmail, IsNotEmpty, IsString, MinLength, IsNumber } from 'class-validator';

export class JobseekerSignUpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsNumber()
  yearsOfExperience: number;

  @IsNotEmpty()
  @IsString()
  cv: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  qualification: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  role: string;
}
export class EmployerSignUpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  companyName: string;

  @IsNotEmpty()
  @IsString()
  aboutCompany: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  companyAddress: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  numberOfEmployees: number;

  @IsNotEmpty()
  @IsString()
  industry: string;

  @IsNotEmpty()
  @IsString()
  employerType: string;

  @IsNotEmpty()
  @IsString()
  registrationNumber: string;

  @IsNotEmpty()
  @IsString()
  registrationImage: string;

  @IsNotEmpty()
  @IsString()
  role: string;
}

export class LinkedinOptimizerSignUpDto {
  @IsNotEmpty()
  @IsString()
  linkedinProfile: string;

  @IsNotEmpty()
  @IsString()
  workHours: string;

  @IsNotEmpty()
  @IsString()
  currentJob: string;

  @IsNotEmpty()
  @IsString()
  industry: string;

  @IsNotEmpty()
  @IsString()
  yearsOfExperience: number;


  @IsNotEmpty()
  @IsString()
  skills: string;

  @IsNotEmpty()
  @IsString()
  targetAudience: string;

  @IsNotEmpty()
  @IsString()
  optimizeSections: string;

  @IsNotEmpty()
  @IsString()
  optimizationGoal: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  responseTime: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  avatar: string;

  @IsNotEmpty()
  @IsString()
  role: string;
}
export class CvWriterSignUpDto {
  @IsString()
  @IsNotEmpty()
  portfolio: string;

  @IsNumber()
  @IsNotEmpty()
  yearsOfExperience: number;

  @IsString()
  @IsNotEmpty()
  specialization: string;

  @IsString()
  @IsNotEmpty()
  bio: string;

  @IsString()
  @IsNotEmpty()
  education: string;

  @IsString()
  @IsNotEmpty()
  workHours: string;

  @IsString()
  @IsNotEmpty()
  responseTime: string;


  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  avatar: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  role: string;
}

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  role: string; // This will be used to determine the role-specific DTO
}

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  role: string;
}

export class ForgetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class SuspendUserDto {
  @IsNotEmpty()
  @IsString()
  userId: string;
}
