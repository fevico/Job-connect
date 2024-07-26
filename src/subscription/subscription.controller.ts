import { Body, Controller, Post } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/subcription.dto';

@Controller('subscription')
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) {}

    @Post('create')
    async createSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto) {
      return this.subscriptionService.createSubscription(createSubscriptionDto);
    }
}
