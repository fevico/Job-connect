import {  BadRequestException, Body, Controller, Get, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
// import { RoleGuard } from 'src/guards/role.guard';
import { AuthenitcationGuard } from 'src/guards/auth.guard';
import {  CvWriterSignUpDto, EmployerSignUpDto, ForgetPasswordDto, JobseekerSignUpDto, LinkedinOptimizerSignUpDto, SignInDto, SignUpDto, SuspendUserDto } from './dto/user.dto';
import { Request } from "express";
import { CvWriterUpdateDto, EmployerDto, EmployerUpdateDto, JobseekerUpdateDto, LinkedinOptimizerUpdateDto, userDto } from './dto/profile.dto';


@Controller('user')
export class UserController {
    constructor(private userService: UserService){}

    @Post('register')
    async register(@Body() body: any) {
      const { role } = body;
  
      if (!role) {
        throw new BadRequestException('Role is required');
      }
  
      let registerDto;
  
      switch (role) {
        case 'jobseeker':
          registerDto = new JobseekerSignUpDto();
          break;
        case 'employer':
          registerDto = new EmployerSignUpDto();
          break;
        case 'linkedinOptimizer':
          registerDto = new LinkedinOptimizerSignUpDto();
          break;
        case 'cvWriter':
          registerDto = new CvWriterSignUpDto();
          break;
        default:
          throw new BadRequestException('Invalid user role');
      }
  
      Object.assign(registerDto, body);
  
      return this.userService.register(registerDto);
    }
  

    @Post('resend-verification-email')
    async resendVerificationEmail(@Body('email') email: string) {
      return this.userService.resendVerificationEmail(email);
}

    @Post('verify-email/:id')
    async verifyEmail(@Param('id') id: string, @Body('token') token: string){
      return this.userService.verifyEmail(id, token);
    }

    @Post('login')
  async login(@Body() loginDto: SignInDto) {
    return this.userService.login(loginDto);
  }

  @UseGuards(AuthenitcationGuard) // Apply your authentication guard
  @Put('/change-password/:userId') // Use dynamic route parameter for userId
  async changePassword(
    @Param('userId') userId: string,
    @Body('newPassword') newPassword: string
  ) {
    return this.userService.changePassword(userId, newPassword);
  }

  @Post('forgot-password')
  async requestPasswordReset(@Body() body: ForgetPasswordDto) {
    return this.userService.requestPasswordReset(body);
  }

  @Post('verify-token/:id')
  async verifyToken(@Param('id') id: string, @Body('token') token: string){
   
    return this.userService.verifyToken(id, token);
  }

  @Post('reset-password/:id')
  async resetPassword(
    @Param('id') id: string,
    @Body('newPassword') newPassword: string
  ) {
    return this.userService.resetPassword(id, newPassword);
  }

  @Patch('update-profile')
  @UseGuards(AuthenitcationGuard)
  async updateProfile(@Body() body: any, @Req() req: Request) {
    const userRole = req.user.role;
    const userId = req.user.id;
  
    switch (userRole) {
      case 'jobseeker': {
        const userProfileDto = new JobseekerUpdateDto();
        Object.assign(userProfileDto, body);
        return this.userService.updateUserProfile(userProfileDto, userId);
      }
  
      case 'employer': {
        const updateProfileDto = new EmployerUpdateDto();
        Object.assign(updateProfileDto, body);
        return this.userService.updateEmployerProfile(updateProfileDto, userId);
      }
  
      case 'linkedinOptimizer': {
        const linkedinProfileDto = new LinkedinOptimizerUpdateDto();
        Object.assign(linkedinProfileDto, body);
        return this.userService.updateLinkedinOptimizerProfile(linkedinProfileDto, userId);
      }
  
      case 'cvwriter': {
        const cvWriterDto = new CvWriterUpdateDto();
        Object.assign(cvWriterDto, body);
        return this.userService.updateCvWriterProfile(cvWriterDto, userId);
      }
  
      default: {
        throw new BadRequestException('Invalid user role');
      }
    }
  }
    

  @Get('all-employers')
  async getAllEmployers() {
    return this.userService.getAllEmployers();
  }

  @Get('all-users')
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Post('suspend')
  async suspendUser(@Body() body: SuspendUserDto) {
    return this.userService.suspendUser(body);
  }

  @Get('plan')
  @UseGuards(AuthenitcationGuard)
  async subscribedPlan(@Req() req: Request) {
    const userId = req.user.id;
    return this.userService.subscribedPlan(userId);
  }

  
  @Post('add-rating/:owner')
  @UseGuards(AuthenitcationGuard)
  async rateProduct(
      @Param('owner') owner: string,
      @Body('rating') ratingValue: number,
      @Req() req: Request
  ) {
      const userId = req.user.id;
      return this.userService.addRating(owner, userId, ratingValue);
  }
}

