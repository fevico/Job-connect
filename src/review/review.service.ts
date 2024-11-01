import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './schema/review.schema';
import { Model, Types } from 'mongoose';
import { User } from 'src/user/schema/user.schema';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) { }

  async addRating(ownerId: string, userId: string, ratingValue: number, comment?: string) {
    // Fetch the specific user with the right discriminator
    const user = await this.userModel.findOne({ _id: ownerId, role: { $in: ['cvWriter', 'linkedinOptimizer'] } });
  
    if (!user) throw new NotFoundException('You cannot rate this user');
  
    // Upsert the rating for the user
    const rating = await this.reviewModel.findOneAndUpdate(
      { owner: ownerId, user: userId },
      { rating: ratingValue, comment, user: userId },
      { new: true, upsert: true }
    );
  
    // Calculate the current average rating
    const [result] = await this.reviewModel.aggregate<{ averageRating: number }>([
      { $match: { owner: new Types.ObjectId(ownerId) } },
      { $group: { _id: null, averageRating: { $avg: "$rating" } } },
    ]);
  
    const averageRating = result?.averageRating ?? ratingValue;
    console.log("Calculated averageRating:", averageRating);

    await rating.updateOne({ averageRating }, {new: true});
  
    // Use discriminator model to update the user with average rating
    // const ratedUser = await this.userModel.findOneAndUpdate(
    //   { _id: ownerId, role: { $in: ['cvWriter', 'linkedinOptimizer'] } }, 
    //   { averageRating }, 
    //   { new: true }
    // );
  
    return { rating };
  }
  


  // async getRating(ownerId: string) {
  //   const reviews = await this.reviewModel.find({ owner: ownerId }).populate<{ user: { name: string } }>({ path: 'user', select: 'name' });

  //   if (!reviews || reviews.length === 0) throw new NotFoundException('No reviews found for this product');

  //   // Calculate average rating and extract other details
  //   const ratings = reviews.map(review => review.rating); // Assuming each review has a `rating` field
  //   const averageRating = ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length;

  //   const comments = reviews.map(review => ({
  //     comment: review.comment,
  //     user: review.user.name
  //   }));

  //   return { ratings, averageRating, comments };
  // }

  async getRating(ownerId: string) {
    const reviews = await this.reviewModel.findOne({ owner: ownerId })
    if(!reviews) throw new NotFoundException('No reviews found for this service');
    return {averageRating: reviews.averageRating, reviews};
  }



}
