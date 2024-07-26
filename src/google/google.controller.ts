import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GoogleService } from './google.service';

@Controller('google')
export class GoogleController {
    constructor(private readonly googleService: GoogleService) {}
        // console.log('google controller'

    @Get('')
    @UseGuards(AuthGuard('google'))
   async googleAuth(@Req() req){
    }

    @Get('auth/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req) {
        return this.googleService.googleLogin(req)
    }
}
