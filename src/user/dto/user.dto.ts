import { IsEmail, IsNotEmpty, IsString, MinLength, IsIn } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['jobseeker', 'employer', 'cvwriter'])
  role: string;
} 

export class SignInDto{
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}