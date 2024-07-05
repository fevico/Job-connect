import { IsNotEmpty, IsNumber } from "class-validator";

export class CvProfileDto{
    @IsNotEmpty()
    linkdinUrl: string;

    @IsNotEmpty()
    portfolio: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;
}
