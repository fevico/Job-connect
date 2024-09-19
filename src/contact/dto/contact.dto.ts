import { IsNotEmpty, IsString, IsEmail } from "class-validator";

export class ContactDto {
    @IsNotEmpty()
    @IsEmail() // Validates that the string is a valid email
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly firstName: string;

    @IsNotEmpty()
    @IsString()
    readonly lastName: string;

    @IsNotEmpty()
    @IsString()
    readonly phone: string;

    @IsNotEmpty()
    @IsString()
    readonly message: string;
}

export class updateMessageDto {
    @IsNotEmpty()
    @IsString()
    readonly  status: string;
}
