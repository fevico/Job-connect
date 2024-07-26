import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './schduler.service';
import { SubscriptionModule } from 'src/subscription/subscription.module';

@Module({
  
  imports: [ScheduleModule.forRoot(), SubscriptionModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
