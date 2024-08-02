import { IsArray, IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

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