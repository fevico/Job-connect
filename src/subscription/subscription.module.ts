import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscription, SubscriptionSchema } from './schema/subcription.schema';
import { SubscriptionPayment, SubscriptionPaymentSchema } from './schema/subscriptionPayment';
import { User, userSchema } from 'src/user/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: SubscriptionPayment.name, schema: SubscriptionPaymentSchema },
      { name: User.name, schema: userSchema },
    ])
  ],

  providers: [SubscriptionService],
  controllers: [SubscriptionController],
  exports: [SubscriptionService], // Make sure to export the service

})
export class SubscriptionModule {}
