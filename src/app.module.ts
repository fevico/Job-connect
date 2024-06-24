import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { EmployerModule } from './employer/employer.module';
import { JobModule } from './job/job.module';
import { CategoryModule } from './category/category.module';


@Module({
  imports: [
      // Load environment variables from .env file
      ConfigModule.forRoot({
        envFilePath: '.env', // Specify the path to your .env file
        isGlobal: true, // Make configuration global
      }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UserModule,
    EmployerModule,
    JobModule,
    CategoryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
