import { IsEmail, IsNotEmpty, IsString, MinLength, IsIn, IsOptional, IsNumber } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  companyAddress?: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

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
  nationality?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['jobseeker', 'employer', 'cvwriter'])
  role: string;
} 

export class SignInDto{
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}