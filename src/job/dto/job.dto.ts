import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class JobDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  location: string;

  @IsNotEmpty()
  @IsNumber()
  priceFrom: number;

  @IsNotEmpty()
  @IsNumber()
  priceTo: number;

  @IsNotEmpty()
  skills: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsNotEmpty()
  industry: string;

  @IsString()
  @IsOptional()
  aboutCompany?: string;

  @IsString()
  @IsOptional()
  companyName?: string;

  // Add the missing fields

  @IsString()
  @IsNotEmpty()
  referral: string; // assuming referral is a string (yes/no)

  @IsNumber()
  @IsNotEmpty()
  referralAmount: number; // assuming referralAmount is a number
}


export class UpdateJobDto {

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    title?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    location?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    price?: number;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    duration?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    skills?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    categoryId?: string;

    @IsString()
    aboutCompany?: string
}