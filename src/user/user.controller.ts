import {  BadRequestException, Body, Controller, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
// import { RoleGuard } from 'src/guards/role.guard';
import { AuthenitcationGuard } from 'src/guards/auth.guard';
import { SignInDto, SignUpDto } from './dto/user.dto';
import { Request } from "express";
import { EmployerDto, userDto } from './dto/profile.dto';


@Controller('user')
export class UserController {
    constructor(private userService: UserService){}

    @Post('register')
    async register(@Body() registerDto: SignUpDto) {
      if(!registerDto.role) return new BadRequestException('Role is required');
      // if(registerDto.role === 'jobseeker') return this.userService.registerJobseeker(registerDto);
      
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
  async requestPasswordReset(@Body('email') email: string) {
    return this.userService.requestPasswordReset(email);
  }

  @Post('verify-token/:id')
  async verifyToken(@Param('id') id: string, @Body('token') token: string){
    // if(id !== token){
    //   throw new BadRequestException('Invalid token');
    // }
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

    if (userRole === 'jobseeker' || userRole === 'cvwriter' || userRole === 'linkdinOptimizer') {
      const userProfileDto = new userDto();
      Object.assign(userProfileDto, body);
      return this.userService.updateUserProfile(userProfileDto, userId);
    } else if (userRole === 'employer') {
      const updateProfileDto = new EmployerDto();
      Object.assign(updateProfileDto, body);
      return this.userService.updateEmployerProfile(updateProfileDto, userId);
    }else {
      throw new BadRequestException('Invalid user role');
    }
  }
}

