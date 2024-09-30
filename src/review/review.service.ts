import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './schema/review.schema';
import { Model, Types } from 'mongoose';
import { Product } from 'src/product/schema/product.schema';

@Injectable()
export class ReviewService {
    constructor(
        @InjectModel(Review.name) private reviewModel: Model<Review>,
        @InjectModel(Product.name) private productModel: Model<Product>,
) {}

async addRating(ownerId: string, userId: string, ratingValue: number, comment?: string) {
    // Find the product (or item) by the owner ID
    const product = await this.productModel.findById(ownerId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    
    const [result] = await this.reviewModel.aggregate<{averageRating: number}>([
        {$match: {
            owner: new Types.ObjectId(ownerId)
        }},
        {
          $group:{
            _id: null,
            averageRating: {$avg: "$rating"},
          }
        }
      ])  

    const rating = await this.reviewModel.findOneAndUpdate({ owner: ownerId }, { ratingValue, comment, userId, averageRating: result.averageRating}, { new: true, upsert: true });
    return rating;

    // // Ensure the user is allowed to rate the product (in this case, must own the product)
    // if (product.owner.toString() !== userId) {
    //   throw new Error('You are not allowed to rate this product because you do not own it');
    // }

    // // Check if a review already exists for this product by this user
    // let review = await this.reviewModel.findOne({
    //   owner: ownerId,
    //   user: userId,
    // });

    // if (review) {
    //   // Update the existing rating and comment
    //   review.rating = ratingValue;
    //   if (comment) {
    //     review.comment = comment;
    //   }
    // } else {
    //   // Add a new review
    //   review = await this.reviewModel.create({
    //     owner: new Types.ObjectId(ownerId),
    //     user: new Types.ObjectId(userId),
    //     ratingValue,
    //     comment,
    //   });
    // }

    // // Save the updated review
    // await review.save();
    // return review;
  }


}
