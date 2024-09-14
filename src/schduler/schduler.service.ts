import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SubscriptionService } from '../subscription/subscription.service';
import moment from 'moment';  // Import moment correctly
import { SubscriptionDocument } from 'src/subscription/schema/subcription.schema';

@Injectable()
export class SchedulerService {
  constructor(private readonly subscriptionService: SubscriptionService) {}

//   @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
//   // async handleCron() {
//   //   const now = new Date();
//   //   const subscriptions = await this.subscriptionService.findAllActive();

//   //   for (const subscription of subscriptions) {
//   //     if (moment(subscription.endDate).isBefore(now)) {
//   //       if (subscription.autoRenew) {
//   //         await this.subscriptionService.renewSubscription(subscription as SubscriptionDocument);
//   //       } else {
//   //         await this.subscriptionService.expireSubscription(subscription as SubscriptionDocument);
//   //       }
//   //     }
//   //   }
//   // }
}
