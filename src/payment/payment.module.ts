import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './schema/payment.schema';
import { Wallet, WalletSchema } from 'src/wallet/shema/wallet.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: Wallet.name, schema: WalletSchema },
    ])
  ],
  providers: [PaymentService],
  controllers: [PaymentController]
})
export class PaymentModule {}
