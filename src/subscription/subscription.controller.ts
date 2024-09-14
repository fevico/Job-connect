import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/subcription.dto';
import { AuthenitcationGuard } from 'src/guards/auth.guard';
import { Request } from 'express';

@Controller('subscription')
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) {}

    @Post('create')
    async createSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto) {
      return this.subscriptionService.createSubscription(createSubscriptionDto);
    }

    @Post('purchase')
    @UseGuards(AuthenitcationGuard)
    async purchaseSubscription(@Body() body: string, @Req() req: Request, @Res() res: Response) {
      // const userId = req.user.id;
      return this.subscriptionService.purchaseSubscription(body, res);
    }

    @Get('verify-payment/:reference')
    verifyPayment(
      @Param('reference') reference: string, // Corrected Param usage
      @Req() req: Request,
      @Res() res: Response,
    ) {
      return this.subscriptionService.verifySubscriptionPayment(reference, res);
    }
}
