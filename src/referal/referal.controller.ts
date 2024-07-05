import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ReferalService } from './referal.service';
import { Request} from 'express';
import { AuthenitcationGuard } from 'src/guards/auth.guard';
import { Types } from 'mongoose';

@Controller('referal')
export class ReferalController {
    constructor(private referalService: ReferalService){}

    @Post('refer-candidate')
    @UseGuards(AuthenitcationGuard)
    referCandidate(@Body() body: any, @Req() req: Request){
        const userId = req.user.id;
        return this.referalService.referCandidate(body, userId);
    }

    @Get('all-referrals')
    // @UseGuards(AuthenitcationGuard)
    getAllReferrals(){
        // const userId = req.user.id;
        return this.referalService.getAllReferrals();
    }

    @Get('my-referrals')
    @UseGuards(AuthenitcationGuard)
    getMyReferrals(@Req() req: Request){
        const userId = req.user.id;
        return this.referalService.getMyReferrals(userId);
    }

    @Get('my-referral-count')
    @UseGuards(AuthenitcationGuard)
    getMyReferralCount(@Req() req: Request){
        const userId = req.user.id;
        return this.referalService.getMyReferralCount(userId);
    }

    @Get('my-referral-earnings')
    @UseGuards(AuthenitcationGuard)
    getMyReferralEarnings(@Req() req: Request){
        const userId = req.user.id;
        return this.referalService.getMyReferralEarnings(userId);
    }

    @Patch('update-referral-status')
    @UseGuards(AuthenitcationGuard)
    updateReferralStatus(@Body() body: any, @Req() req: Request){
        const userId = new Types.ObjectId(req.user.id);
        return this.referalService.updateReferralStatus(body, userId.toHexString());
    }
}
