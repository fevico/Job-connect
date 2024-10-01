import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './schema/review.schema';
import { Product, ProductSchema } from 'src/product/schema/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: Product.name, schema: ProductSchema }
    ]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService]
})
export class ReviewModule {}
