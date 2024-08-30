import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './schema/payment.schema';
import { Wallet, WalletSchema } from 'src/wallet/shema/wallet.schema';
import { Product, ProductSchema } from 'src/product/schema/product.schema';
import { User, userSchema } from 'src/user/schema/user.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: Wallet.name, schema: WalletSchema },
      { name: Product.name, schema: ProductSchema },
      { name: User.name, schema: userSchema },
    ])
  ],
  providers: [PaymentService],
  controllers: [PaymentController]
})
export class PaymentModule {}
