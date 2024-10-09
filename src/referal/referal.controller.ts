import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ReferalService } from './referal.service';
import { Request} from 'express';
import { AuthenticationGuard } from 'src/guards/auth.guard';
import { ReferralDto } from './dto/referral.dto';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { Roles } from 'src/decorator/role.decorator';

@Controller('referal')
export class ReferalController {
    constructor(private referalService: ReferalService){}

    @Post('refer-candidate')
    @UseGuards(AuthenticationGuard)
    referCandidate(@Body() body: ReferralDto, @Req() req: Request){
        const userId = req.user.id;
        return this.referalService.referCandidate(body, userId);
    }

    @Get('all-referrals')
     @UseGuards(AuthenticationGuard)
    getAllReferrals(){
        // const userId = req.user.id;
        return this.referalService.getAllReferrals();
    }

    @Get('my-referrals')
    @UseGuards(AuthenticationGuard)
    getMyReferrals(@Req() req: Request){
        const userId = req.user.id;
        return this.referalService.getMyReferrals(userId);
    }

    @Get('my-referral-count')
    @UseGuards(AuthenticationGuard)
    getMyReferralCount(@Req() req: Request){
        const userId = req.user.id;
        return this.referalService.getMyReferralCount(userId);
    }

    @Get('my-referral-earnings')
    @UseGuards(AuthenticationGuard)
    getMyReferralEarnings(@Req() req: Request){
        const userId = req.user.id;
        return this.referalService.getMyReferralEarnings(userId);
    }

    // @Patch('update-referral-status')
    // @UseGuards(AuthenticationGuard)
    // updateReferralStatus(@Body() body: any, @Req() req: Request){
    //     const userId = new Types.ObjectId(req.user.id);
    //     return this.referalService.updateReferralStatus(body, userId.toHexString());
    // }

    @Roles(['admin'])
    @Get('referral-jobs')
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    getJobReferral(){
        return this.referalService.getReferralJob()
    }

    @Get('user-referrals')
    @UseGuards(AuthenticationGuard)
    getUserReferrals(@Req() req: Request){
        const userId = req.user.id;
        return this.referalService.getUserReferrals(userId);
    }
}
