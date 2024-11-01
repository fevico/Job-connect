import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './schema/review.schema';
import { Model, Types } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { Product } from 'src/product/schema/product.schema';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) { }

  async addRating(ownerId: string, userId: string, ratingValue: number, comment?: string) {
    // Fetch the specific user with the right discriminator
    const user = await this.userModel.findOne({ _id: ownerId, role: { $in: ['cvWriter', 'linkedinOptimizer'] } });
  
    if (!user) throw new NotFoundException('You cannot rate this user');
  
    // Upsert the rating for the user
    const rating = await this.reviewModel.findOneAndUpdate(
      { serviceProvider: ownerId },
      { rating: ratingValue, comment},
      { new: true, upsert: true }
    );
  
    // Calculate the current average rating
    const [result] = await this.reviewModel.aggregate<{ averageRating: number }>([
      { $match: { serviceProvider: new Types.ObjectId(ownerId) } },
      { $group: { _id: null, averageRating: { $avg: "$rating" } } },
    ]);

  
    const averageRating = result?.averageRating ?? ratingValue;
    console.log("Calculated averageRating:", averageRating);

    // await rating.updateOne({ averageRating }, {new: true});
  
    // Use discriminator model to update the user with average rating
    // const ratedUser = await this.userModel.findOneAndUpdate(
    //   { _id: ownerId, role: { $in: ['cvWriter', 'linkedinOptimizer'] } }, 
    //   { averageRating }, 
    //   { new: true }
    // );

    const ratedUser = await this.productModel.findOneAndUpdate(
      { userId: ownerId },
      { averageRating },
      { new: true }
    );

    return {
      rating: rating ? { id: rating._id, rating: rating.rating, comment: rating.comment } : null,
      ratedUser: ratedUser ? { id: ratedUser._id, averageRating: ratedUser.averageRating } : null,
    };
    // return { rating, ratedUser };
  }
  

  async getRating(ownerId: string) {
    const reviews = await this.productModel.findOne({ userId: ownerId })
    if(!reviews) throw new NotFoundException('No reviews found for this service');
    return {averageRating: reviews.averageRating};
  }



}
