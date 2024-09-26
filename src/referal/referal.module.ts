import { Module } from '@nestjs/common';
import { ReferalService } from './referal.service';
import { ReferalController } from './referal.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Referal, ReferalSchema } from './schema/referal.schema';
import { Job, JobSchema } from 'src/job/schema/job.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: Referal.name, schema: ReferalSchema },
      { name: Job.name, schema: JobSchema },
      { name: User.name, schema: UserSchema },
    ])
  ],
  providers: [ReferalService],
  controllers: [ReferalController]
})
export class ReferalModule {}
