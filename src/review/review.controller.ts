import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { AuthenticationGuard } from 'src/guards/auth.guard';
import { Request } from 'express';

@Controller('review')
export class ReviewController {

    constructor(private reviewService: ReviewService) {}

   @Post('add-rating/:owner')
    @UseGuards(AuthenticationGuard)
  async rateProduct(
      @Param('owner') owner: string,
      @Body('rating') ratingValue: number,
      @Req() req: Request
  ) {
      const userId = req.user.id;
      return this.reviewService.addRating(owner, userId, ratingValue);
  }
}
