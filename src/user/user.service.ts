import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PasswordResetToken } from './schema/passwordResetToken';
import { generateToken } from '../utils/user.token';
import { SignInDto, SignUpDto } from './dto/user.dto';
import { EmailVerificationToken } from './schema/emailVerificationToken';
import { sendVerificationToken } from 'src/utils/mail';
import { EmployerDto, userDto } from './dto/profile.dto';


@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(PasswordResetToken.name) private passwordResetModel: Model<PasswordResetToken>,
    @InjectModel(EmailVerificationToken.name) private EmailVerificationTokenModel: Model<EmailVerificationToken>,

    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: SignUpDto) {
    const { email, password, role } = registerDto;

    // Check if user with email already exists
    const emailExist = await this.userModel.findOne({ email });
    if (emailExist) {
      throw new UnauthorizedException('Email already exists');
    }


    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      ...registerDto, // Spread registerDto first
      password: hashedPassword, // Then overwrite the password with the hashed password
    });

    
    if(role === 'jobseeker'){
      newUser.isActive = true
    }

    // Save user to database
    await newUser.save();

    const token = generateToken()

    const hashedToken = await bcrypt.hash(token, 10)

    await this.EmailVerificationTokenModel.create({
      userId: newUser._id,
      token: hashedToken,
    })
    sendVerificationToken(email, token)
    console.log(token)

    return { message: 'User registered successfully' };
  }

  async resendVerificationEmail(email){
    const user = await this.userModel.findOne(email)
    if(!user){
      throw new NotFoundException('User not found')
    }
    const token = generateToken()
    const hashedToken = await bcrypt.hash(token, 10)
    await this.EmailVerificationTokenModel.create({
      userId: user._id,
      token: hashedToken,
    })
    sendVerificationToken(user.email, token)
    return { message: 'Verification email sent successfully' }
  }

  async verifyEmail(id, token){
    const user = await this.userModel.findById(id)
    if(!user){
      throw new NotFoundException('User not found')
    }
    const emailVerificationToken = await this.EmailVerificationTokenModel.findOne({userId: id})
    if(!emailVerificationToken){
      throw new NotFoundException('Email verification token not found')
    }
    const hashedToken = emailVerificationToken.token
    const isMatch = await bcrypt.compare(token, hashedToken)
    if(!isMatch){
      throw new UnauthorizedException('Invalid token')
    }
    user.isVerified = true
    await user.save()
    return { message: 'Email verified successfully' }
  }

      async login(loginDto: SignInDto){
        const {email, password} = loginDto;
  
        const user = await this.userModel.findOne({email});
        if(!user){
          throw new UnauthorizedException('Invalid credentials');
        }
        // if(!user.isVerified) throw new UnauthorizedException('Email not verified');
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
          throw new UnauthorizedException('Invalid credentials');
        }
        const payload = {
          email: user.email,
          id: user._id,
          role: user.role, 
        } 
  
         const token = await this.jwtService.sign(payload, {secret: process.env.JWT_SECRET})
    
      return token;

    }

    async changePassword(userId: string, newPassword: string) {
      try {
        const user = await this.userModel.findById(userId);
        if (!user) {
          return { message: 'User not found' };
        }
  
        const passwordMatched = await bcrypt.compare(newPassword, user.password);
        if (passwordMatched) {
          return { message: 'New password must be different from the old password' };
        }
  
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.userModel.findByIdAndUpdate(userId, { password: hashedPassword });
        return { message: 'Password changed successfully' };
      } catch (error) {
        console.error('Error changing password:', error);
        throw new Error('Internal Server Error');
      }
    }

    async requestPasswordReset(email: string) {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new NotFoundException({ message: 'User not found'})
      }
  
      // Generate reset token and expiry time
      // const token = crypto.randomBytes(20).toString('hex'); // Generate a random token  
      const token = generateToken()


      const hashedToken = await bcrypt.hash(token, 10)
      // Save token and expiry time to user document
      // const passwordResetLink = `${process.env.PASSWORD_RESET_LINK}?id=${user._id}&token=${token}`;

      const resetToken = await this.passwordResetModel.create({
        userId: user._id,
        token: hashedToken,
      })
  
      // Send reset token to the user (e.g., via email)
      // Example: SendEmailService.sendResetPasswordEmail(user.email, resetToken);
  
      return { message: 'Password reset token generated and sent', token };
    }

    async verifyToken(id: string, token: string) {
      const passwordResetToken = await this.passwordResetModel.findOne({
        userId: id,
      });
    
      if (!passwordResetToken) {
        throw new UnauthorizedException('Invalid or expired password reset token');
      }
    
      const tokenMatched = await bcrypt.compare(token, passwordResetToken.token);
      if (!tokenMatched) {
        throw new UnauthorizedException('Invalid or expired token');
      }
    
      return { message: 'Token verified successfully' };
    }
    

  async resetPassword(id: string, newPassword: string) {
    const userExist = await this.userModel.findById(id);
    if (!userExist) {
      throw new NotFoundException('User not found');
    } 

  
    const passwordMatched = await bcrypt.compare(newPassword, userExist.password);
    if (passwordMatched) {
      throw new UnauthorizedException('New password must be different from the old password');
    }
  
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    userExist.password = hashedPassword;
    await userExist.save();
  
    await this.passwordResetModel.findOneAndDelete({ userId: userExist._id });
  
    return { message: 'Password reset successfully' };
  }

  async updateUserProfile(userProfileDto: userDto, userId: string) {
    try {
        const userProfile = await this.userModel.findByIdAndUpdate(userId, userProfileDto, { new: true });
        if (!userProfile) {
            throw new NotFoundException('User not found');
        }
        return userProfile;
    } catch (error) {
        throw new InternalServerErrorException('Failed to update user profile');
    }
}


  async updateEmployerProfile(updateProfileDto: EmployerDto, userId: string) { 
    // Logic to update employer profile
   const updateEmployerProfile = await this.userModel.findByIdAndUpdate(userId, updateProfileDto, { new: true });
    if(!updateEmployerProfile) throw new NotFoundException('User not found');
    return updateEmployerProfile
  }

    }
