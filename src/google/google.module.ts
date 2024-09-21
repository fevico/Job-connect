import { Module } from '@nestjs/common';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';
import { GoogleStrategy } from './google-strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { User, userSchema } from 'src/user/schema/user.schema'; 

@Module({
  imports: [
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '5d' }
    }),
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
  ],
  controllers: [GoogleController],
  providers: [GoogleService, GoogleStrategy],
}) 
export class GoogleModule {}
