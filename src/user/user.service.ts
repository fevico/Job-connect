import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto'; // For generating random tokens
import { JwtService } from '@nestjs/jwt';
import { PasswordResetToken } from './schema/passwordResetToken';
import { generateToken } from './utils/user.token';
import { SignInDto, SignUpDto } from './dto/user.dto';


@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(PasswordResetToken.name) private passwordResetModel: Model<PasswordResetToken>,
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

    // Create new user
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      role,
    });

    // Save user to database
    await newUser.save();

    return { message: 'User registered successfully' };
  }

      async login(loginDto: SignInDto){
        const {email, password} = loginDto;
  
        const user = await this.userModel.findOne({email});
        if(!user){
          throw new UnauthorizedException('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
          throw new UnauthorizedException('Invalid credentials');
        }
        const payload = {
          email: user.email,
          id: user._id,
          role: user.role, 
        } 
  
         const access_token = await this.jwtService.sign(payload, {secret: process.env.JWT_SECRET})
    
      return access_token

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
    }
