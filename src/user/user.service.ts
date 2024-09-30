import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CvWriter, Employer, JobSeeker, LinkedinOptimizer, User } from './schema/user.schema';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PasswordResetToken } from './schema/passwordResetToken';
import { generateToken } from '../utils/user.token';
import { CvWriterSignUpDto, EmployerSignUpDto, ForgetPasswordDto, JobseekerSignUpDto, LinkedinOptimizerSignUpDto, SignInDto, SuspendUserDto } from './dto/user.dto';
import { EmailVerificationToken } from './schema/emailVerificationToken';
import { resetPasswordToken, sendVerificationToken } from 'src/utils/mail';
import { CvWriterUpdateDto, EmployerUpdateDto, JobseekerUpdateDto, LinkedinOptimizerUpdateDto } from './dto/profile.dto';
import { SubscriptionPayment } from 'src/subscription/schema/subscriptionPayment';


@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel('JobSeeker') private readonly jobSeekerModel: Model<JobSeeker>,
    @InjectModel('Employer') private readonly employerModel: Model<Employer>,
    @InjectModel('CvWriter') private readonly cvWriterModel: Model<CvWriter>,
    @InjectModel('LinkedinOptimizer') private readonly linkedinOptimizerModel: Model<LinkedinOptimizer>,
    @InjectModel(PasswordResetToken.name) private passwordResetModel: Model<PasswordResetToken>,
    @InjectModel(EmailVerificationToken.name) private EmailVerificationTokenModel: Model<EmailVerificationToken>,
    @InjectModel(SubscriptionPayment.name) private SubscriptionPaymentModel: Model<SubscriptionPayment>,

    private readonly jwtService: JwtService,
  ) { }


  async register(registerDto: JobseekerSignUpDto | EmployerSignUpDto | LinkedinOptimizerSignUpDto | CvWriterSignUpDto) {
    if (registerDto instanceof JobseekerSignUpDto) {
      return this.registerJobseeker(registerDto);
    } else if (registerDto instanceof EmployerSignUpDto) {
      return this.registerEmployer(registerDto);
    } else if (registerDto instanceof LinkedinOptimizerSignUpDto) {
      return this.registerLinkedinOptimizer(registerDto);
    } else if (registerDto instanceof CvWriterSignUpDto) {
      return this.registerCvWriter(registerDto);
    }
    throw new BadRequestException('Invalid registration details');
  }

  async registerJobseeker(dto: JobseekerSignUpDto) {
    const { email, password, name, qualification } = dto;
    
    // Ensure the password is provided
    if (!password) {
      throw new BadRequestException('Password is required');
    }
    // Check if the user with email already exists
    const emailExist = await this.userModel.findOne({ email });
    if (emailExist) {
      throw new UnauthorizedException('Email already exists');
    }
  
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Explicitly set the role as 'jobSeeker'
    const newUser = new this.jobSeekerModel({
      ...dto,
      password: hashedPassword,
      role: 'jobseeker',  // Make sure to set the role
    });
  
    // Save the user to the database
    await newUser.save();
  
    const token = generateToken();
  
    const hashedToken = await bcrypt.hash(token, 10);
  
    await this.EmailVerificationTokenModel.create({
      userId: newUser._id,
      token: hashedToken,
    });
  
    sendVerificationToken(email, token, name);
  
    return {
      message: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
      token: token,
    };
  }  

  async registerEmployer(dto: EmployerSignUpDto) {
    // Logic for registering an employer
    const { email, password, role, name } = dto;
    //  Check if user with email already exists
    const emailExist = await this.userModel.findOne({ email });
    if (emailExist) {
      throw new UnauthorizedException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.employerModel({
      ...dto, // Spread registerDto first
      password: hashedPassword, // Then overwrite the password with the hashed password
      role: 'employer'
    });


    // Save user to database
    await newUser.save();

    const token = generateToken()

    const hashedToken = await bcrypt.hash(token, 10)

    await this.EmailVerificationTokenModel.create({
      userId: newUser._id,
      token: hashedToken,
    })
    sendVerificationToken(email, token, name)

    return { message: { id: newUser._id, email: newUser.email, name: newUser.name, role: newUser.role }, token: token };
  }

  async registerLinkedinOptimizer(dto: LinkedinOptimizerSignUpDto) {
    const { email, password, role, name } = dto;
    //  Check if user with email already exists
    const emailExist = await this.userModel.findOne({ email });
    if (emailExist) {
      throw new UnauthorizedException('Email already exists');
    }


    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.linkedinOptimizerModel({
      ...dto, // Spread registerDto first
      password: hashedPassword, 
      role: 'linkedinoptimizer'
    });

    // Save user to database
    await newUser.save();

    const token = generateToken()

    const hashedToken = await bcrypt.hash(token, 10)

    await this.EmailVerificationTokenModel.create({
      userId: newUser._id,
      token: hashedToken,
    })
    sendVerificationToken(email, token, name)

    return { message: { id: newUser._id, email: newUser.email, name: newUser.name, role: newUser.role }, token: token };
    // Logic for registering a LinkedIn optimizer
  }

  async registerCvWriter(dto: CvWriterSignUpDto) {
    // Logic for registering a CV writer
    const { email, password, role, name } = dto;
    //  Check if user with email already exists
    const emailExist = await this.userModel.findOne({ email });
    if (emailExist) {
      throw new UnauthorizedException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.cvWriterModel({
      ...dto, // Spread registerDto first
      password: hashedPassword, // Then overwrite the password with the hashed password
      role: 'cvwriter'
    });

    // Save user to database
    await newUser.save();

    const token = generateToken()

    const hashedToken = await bcrypt.hash(token, 10)

    await this.EmailVerificationTokenModel.create({
      userId: newUser._id,
      token: hashedToken,
    })
    sendVerificationToken(email, token, name)

    return { message: { id: newUser._id, email: newUser.email, name: newUser.name, role: newUser.role }, token: token };
  }


  async resendVerificationEmail(email: string) {
    // Find the user by email
    const user = await this.userModel.findOne({ email });

    // If the user doesn't exist, throw an error
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate a verification token
    const token = generateToken();

    // Hash the token before storing it in the database
    const hashedToken = await bcrypt.hash(token, 10);

    // Save the hashed token to the database
    await this.EmailVerificationTokenModel.create({
      userId: user._id,
      token: hashedToken,
    });

    // Send the verification email
    await sendVerificationToken(user.email, token, user.name);

    // Return a success message
    return { message: 'Verification email sent successfully', token: token, id: user._id };
  }


  async verifyEmail(id: string, token: string): Promise<{ message: string }> {
    // Find the user by ID
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Find the email verification token associated with the user
    const emailVerificationToken = await this.EmailVerificationTokenModel.findOne({ userId: id });
    if (!emailVerificationToken) {
      throw new NotFoundException('Email verification token not found');
    }

    // Compare the provided token with the stored hashed token
    const isMatch = await bcrypt.compare(token, emailVerificationToken.token);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Mark the user as verified
    user.isVerified = true;
    await user.save();

    // Optionally, delete the used email verification token from the database
    await this.EmailVerificationTokenModel.deleteOne({ userId: id });

    return { message: 'Email verified successfully' };
  }


  async login(loginDto: SignInDto) {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // if(!user.isVerified) throw new UnauthorizedException('Email not verified');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    }

    const token = await this.jwtService.sign(payload, { secret: process.env.JWT_SECRET })

    return { token, data: { name: user.name, email: user.email, id: user._id, role: user.role } };

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

  async requestPasswordReset(body: ForgetPasswordDto) {
    const { email } = body;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException({ message: 'User not found' })
    } 
    const token = generateToken()

    const hashedToken = await bcrypt.hash(token, 10)
    // Save token and expiry time to user document

    const resetToken = await this.passwordResetModel.create({
      userId: user._id,
      token: hashedToken,
    })

    resetPasswordToken(user.email, token, user.name)

    return { message: 'Password reset token generated and sent', token, id: user._id };
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

  private async updateUserProfileHelper(userProfileDto: any, userId: string) {
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

  async updateUserProfile(userProfileDto: JobseekerUpdateDto, userId: string) {
    return this.updateUserProfileHelper(userProfileDto, userId);
  }

  async updateLinkedinOptimizerProfile(userProfileDto: LinkedinOptimizerUpdateDto, userId: string) {
    return this.updateUserProfileHelper(userProfileDto, userId);
  }

  async updateCvWriterProfile(userProfileDto: CvWriterUpdateDto, userId: string) {
    return this.updateUserProfileHelper(userProfileDto, userId);
  }

  async updateEmployerProfile(updateProfileDto: EmployerUpdateDto, userId: string) {
    return this.updateUserProfileHelper(updateProfileDto, userId);
  }


  async getAllEmployers() {
    // Find all users with the role 'employer', excluding the password field
    const employers = await this.userModel.find({ role: 'employer' }).select('-password');

    // If no employers are found, throw a NotFoundException
    if (!employers || employers.length === 0) {
      throw new NotFoundException('No employers found');
    }

    // Return the list of employers
    return employers;
  }

  async getAllUsers() {
    // Find all users with the role 'employer', excluding the password field
    const users = await this.userModel.find().select('-password');

    // If no employers are found, throw a NotFoundException
    if (!users || users.length === 0) {
      throw new NotFoundException('No user details found');
    }

    // Return the list of employers
    return users;
  }



  async suspendUser(body: SuspendUserDto) {
    const { userId } = body;

    // Find the user by ID
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Toggle the suspend status (true to false, false to true)
    user.suspended = !user.suspended;

    await user.save();

    // Return message based on the new suspend status
    return {
      message: user.suspended ? 'User suspended successfully' : 'User has been resumed successfully'
    };
  }

  async subscribedPlan(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
  }

  if(user.role === 'employer'){
    const subscription = await this.SubscriptionPaymentModel.findOne({userId});
    if(!subscription) throw new NotFoundException('No subscription found for this user');
    return subscription;
  }
  }


async approveUser(body: any) {
  const { userId } = body;
  const user = await this.userModel.findById(userId);

  if (!user) {
    throw new NotFoundException('User not found');
  }

  (user as any).isApproved = true; // Temporarily cast to `any`
  await user.save();
  return { message: 'User approved successfully' };
}

async getAllApprovedUsers(){
  const users = await this.userModel.find({isApproved: true}).select('-password');
  if (!users || users.length === 0) {
    throw new NotFoundException('No approved users found');
  }
  return users;
}

async getAllUnapprovedUsers(){
  const users = await this.userModel.find({isApproved: false}).select('-password');
  if (!users || users.length === 0) {
    throw new NotFoundException('No unapproved users found');
  }
  return users;
}

}

