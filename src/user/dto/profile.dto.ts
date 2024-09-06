import { IsArray, IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class userDto{
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    gender?: string;

    @IsOptional()
    @IsDate()
    dateOfBirth?: Date;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @IsOptional()
    @IsString()
    nationality?: string
    
    @IsOptional()
    @IsString()
    yearOfExperience?: string

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    skills?: string[];

    @IsOptional()
    @IsString()
    qualification?: string

    @IsOptional()
    @IsString()
    Cv?: string
}

export class EmployerDto{
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    companyName?: string;

    @IsNotEmpty()
    phone?: string;

    @IsOptional()
    @IsString()
    companyAddress?: string;

    @IsOptional()
    @IsString()
    companyDescription?: string;

    @IsOptional()
    @IsString()
    nationality?: string;

    @IsOptional()
    @IsString()
    state?: string;

    @IsOptional()
    @IsString()
    location?: string;
}

export class JobseekerUpdateDto {
  
    @IsOptional()
    @IsString()
    name?: string;
  
    @IsOptional()
    @IsString()
    phone?: string;
  
    @IsOptional()
    @IsNumber()
    yearsOfExperience?: number;
  
    @IsOptional()
    @IsString()
    Cv?: string;
  
    @IsOptional()
    @IsString()
    location?: string;
  
    @IsOptional()
    @IsString()
    qualification?: string;
  
    @IsOptional()
    @IsString()
    gender?: string;
  } 

  export class EmployerUpdateDto {  
  
    @IsOptional()
    @IsString()
    companyName?: string;
  
    @IsOptional()
    @IsString()
    name?: string;
  
    @IsOptional()
    @IsString()
    companyAddress?: string;
  
    @IsOptional()
    @IsString()
    phone?: string;
  
    @IsOptional()
    @IsString()
    location?: string;
  
    @IsOptional()
    @IsString()
    gender?: string;
  } 
  
  
  export class LinkedinOptimizerUpdateDto{
    @IsNotEmpty()
    @IsString()
    linkedinProfile: string;
  
    @IsNotEmpty()
    @IsString()
    linkedinOptimization: string;
  
    @IsOptional()
    @IsString()
    name?: string;
  
    @IsOptional()
    @IsString()
    phone?: string;
  
    @IsOptional()
    @IsString()
    avatar?: string;
  }

  export class CvWriterUpdateDto {
    @IsOptional()
    @IsString()
    professionalInformation?: string;
  
    @IsOptional()
    @IsString()
    workAvailability?: string;
  
    @IsOptional()
    @IsString()
    name?: string;
  
    @IsOptional()
    @IsString()
    phone?: string;
  
    @IsOptional()
    @IsString()
    avatar?: string;
  
    @IsOptional()
    @IsString()
    location?: string;
  }