import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
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

    // @Post('purchase')
    // @UseGuards(AuthenitcationGuard)
    // async purchaseSubscription(@Body() body: string, @Req() req: Request) {
    //   const userId = req.user.id;
    //   return this.subscriptionService.purchaseSubscription(body);
    // }
}
