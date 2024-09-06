import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schema/product.schema';
import { User, userSchema } from 'src/user/schema/user.schema';

@Module({
   imports: [MongooseModule.forFeature([
    { name: Product.name, schema: ProductSchema },
    { name: User.name, schema: userSchema },
  ])],
  providers: [ProductService],
  controllers: [ProductController]
})
export class ProductModule {}
