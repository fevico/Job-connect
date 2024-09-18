import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { JobModule } from './job/job.module';
import { CategoryModule } from './category/category.module';
import { PaymentModule } from './payment/payment.module';
import { WalletModule } from './wallet/wallet.module';
import { ReferalModule } from './referal/referal.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { GoogleModule } from './google/google.module';
import { ProductModule } from './product/product.module';
import { ContactModule } from './contact/contact.module';


@Module({
  imports: [
      // Load environment variables from .env file
      ConfigModule.forRoot({
        envFilePath: '.env', // Specify the path to your .env file
        isGlobal: true, // Make configuration global
      }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UserModule,
    JobModule,
    CategoryModule,
    PaymentModule,
    WalletModule,
    ReferalModule,
    SubscriptionModule,
    GoogleModule,
    ProductModule,
    ContactModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
