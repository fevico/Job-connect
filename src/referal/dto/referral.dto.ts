import { IsNotEmpty, IsString } from "class-validator";

export class ReferralDto{
    @IsNotEmpty()
    @IsString()
    jobId: string

    @IsNotEmpty()
    @IsString()
    email: string

    @IsNotEmpty()
    @IsString()
    fullName : string

}