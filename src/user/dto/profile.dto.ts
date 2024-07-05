import { IsNotEmpty } from "class-validator";

export class JobseekerDto{
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    gender: string;

    @IsNotEmpty()
    dateOfBirth: Date;

    @IsNotEmpty()
    country: string;

    @IsNotEmpty()
    city: string;

    @IsNotEmpty()
    phoneNumber: string;

    @IsNotEmpty()
    nationality: string

    @IsNotEmpty()
    state: string

    @IsNotEmpty()
    professionalInformation: string

    @IsNotEmpty()
    workExperience: string

    @IsNotEmpty()
    educationalBackground: string

    @IsNotEmpty()
    preferences: string

    @IsNotEmpty()
    CV: string
}

export class CvWriterDto{
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    gender: string;

    @IsNotEmpty()
    dateOfBirth: Date;

    @IsNotEmpty()
    country: string;

    @IsNotEmpty()
    city: string;

    @IsNotEmpty()
    phoneNumber: string;

    @IsNotEmpty()
    nationality: string

    @IsNotEmpty()
    state: string

    @IsNotEmpty()
    yearOfExperience: string

    @IsNotEmpty()
    bio: string

    @IsNotEmpty()
    skills: string

    @IsNotEmpty()
    profilePicture: string

    @IsNotEmpty()
    educationalBackground: string
}
export class LinkdinOptimizerDto{
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    gender: string;

    @IsNotEmpty()
    dateOfBirth: Date;

    @IsNotEmpty()
    country: string;

    @IsNotEmpty()
    city: string;

    @IsNotEmpty()
    phoneNumber: string;

    @IsNotEmpty()
    nationality: string

    @IsNotEmpty()
    state: string

    @IsNotEmpty()
    yearOfExperience: string

    @IsNotEmpty()
    bio: string

    @IsNotEmpty()
    skills: string

    @IsNotEmpty()
    profilePicture: string

    @IsNotEmpty()
    educationalBackground: string
}

export class EmployerDto{
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    companyName: string;

    @IsNotEmpty()
    phoneNumber: string;

    @IsNotEmpty()
    companyAddress: string;

    @IsNotEmpty()
    companyDescription: string;

    @IsNotEmpty()
    industry: string;

    @IsNotEmpty()
    country: string;

    @IsNotEmpty()
    companyUrl: string;

    @IsNotEmpty()
    state: string;

    @IsNotEmpty()
    city: string;

    @IsNotEmpty()
    jobTitle: string;
}