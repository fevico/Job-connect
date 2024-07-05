import { Module } from '@nestjs/common';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PlanSchema, Plans } from './schema/plans.shema';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: Plans.name, schema: PlanSchema },
    ])
  ],
  controllers: [PlansController],
  providers: [PlansService]
})
export class PlansModule {}
