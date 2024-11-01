import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
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
      @Body('ratingValue') ratingValue: number,
      @Req() req: Request
  ) {
      const userId = req.user.id;
      return this.reviewService.addRating(owner, userId, ratingValue);
  }

  @Get('get-rating/:owner')
  async getRating(@Param('owner') owner: string) {
      return this.reviewService.getRating(owner);
  }
}
