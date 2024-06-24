import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class JobDto{
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    location: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    duration: string

    @IsNotEmpty()
    skills: string

    @IsString()
    @IsNotEmpty()
    categoryId: string

}