import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from './schema/job.schema';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { AppliedJob, AppliedJobSchema } from './schema/appliedJob.schema';
import { Referal, ReferalSchema } from 'src/referal/schema/referal.schema';
import { SubscriptionPayment, SubscriptionPaymentSchema } from 'src/subscription/schema/subscriptionPayment';

@Module({
  imports:[
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h' }
    }),
    MongooseModule.forFeature([
      { name: Job.name, schema: JobSchema },
      { name: User.name, schema: UserSchema },
      { name: AppliedJob.name, schema: AppliedJobSchema },
      { name: Referal.name, schema: ReferalSchema },
      { name: SubscriptionPayment.name, schema: SubscriptionPaymentSchema },
    ])
  ],
  controllers: [JobController],
  providers: [JobService]
})
export class JobModule {}
