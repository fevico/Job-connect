import { IsNotEmpty, IsString } from "class-validator";

export class ReferralDto{
    @IsNotEmpty()
    @IsString()
    jobId: string

    @IsNotEmpty()
    @IsString()
    candidateEmail: string

    @IsNotEmpty()
    @IsString()
    candidateName: string

    @IsNotEmpty()
    @IsString()
    linkedinProfile: string

    @IsNotEmpty()
    @IsString()
    resume: string
}