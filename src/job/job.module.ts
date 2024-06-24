import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from './schema/job.schema';
import { JwtModule } from '@nestjs/jwt';
import { User, userSchema } from 'src/user/schema/user.schema';

@Module({
  imports:[
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h' }
    }),
    MongooseModule.forFeature([
      { name: Job.name, schema: JobSchema },
      { name: User.name, schema: userSchema },
    ])
  ],
  controllers: [JobController],
  providers: [JobService]
})
export class JobModule {}
