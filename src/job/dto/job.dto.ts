import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class JobDto{
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
    duration: string

    @IsNotEmpty()
    skills: string

    @IsNotEmpty()
    aboutCompany: string

    @IsString()
    @IsNotEmpty()
    categoryId: string

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