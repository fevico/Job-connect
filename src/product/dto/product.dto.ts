import { IsNotEmpty, IsNumber, IsString, IsArray, IsOptional, IsEmail } from "class-validator";

export class ProductDto {
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    // @IsNotEmpty()
    // @IsString()
    // timeFrame: string;

    @IsNotEmpty()
    @IsArray()  // Ensure that the field is an array
    @IsString({ each: true })  // Ensure that each item in the array is a string
    images: string[];
}
export class UpdateProductDto{
    @IsOptional()
    @IsNumber()
    price?: number;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    // @IsOptional()
    // @IsString()
    // timeFrame?: string;

    @IsOptional()
    @IsArray()  // Ensure that the field is an array
    @IsString({ each: true })  // Ensure that each item in the array is a string
    images?: string[];
}

export class UploadCvDetails{
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    cv: string;
}