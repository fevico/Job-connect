import { IsEmail, IsNotEmpty, IsString, MinLength, IsIn, IsOptional, IsNumber } from 'class-validator';

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
  Cv: string;

  @IsNotEmpty()
  @IsString()
  location: string;

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
  name: string;

  @IsNotEmpty()
  @IsString()
  companyAddress: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  role: string;
} 

export class LinkedinOptimizerSignUpDto{
  @IsNotEmpty()
  @IsString()
  linkedinProfile: string;

  @IsNotEmpty()
  @IsString()
  linkedinOptimization: string;

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
  professionalInformation: string;

  @IsString()
  @IsNotEmpty()
  workAvailability: string;

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
  location: string;

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

export class SignInDto{
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class SignUpDto{
  @IsNotEmpty()
  @IsString()
  role: string;
}

export class ForgetPasswordDto{
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class SuspendUserDto{
  @IsNotEmpty()
  @IsString()
  userId: string;
}