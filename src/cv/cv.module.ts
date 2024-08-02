import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CvProfile, CvProfileSchema } from './schema/cvProfile.schema';
import { User, userSchema } from 'src/user/schema/user.schema';

@Module({
  imports:[
    
    MongooseModule.forFeature([
      { name: CvProfile.name, schema: CvProfileSchema },
      { name: User.name, schema: userSchema },
    ])
  ],
  providers: [CvService],
  controllers: [CvController]
})
export class CvModule {}
