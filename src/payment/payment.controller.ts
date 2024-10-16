import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request } from 'express';
import { AuthenticationGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorator/role.decorator';
import { AuthorizationGuard } from 'src/guards/authorization.guard';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) { }
   @UseGuards(AuthenticationGuard)
  @Post('create-payment')
  createPaymentIntent(@Body() body: any, @Req() req: Request, @Res() res: any) {
    // const userId = req.user.id
    return this.paymentService.createPaymentIntent(body, res);
  }


  @Get('verify-payment/:reference')
  verifyPayment(
    @Param('reference') reference: string, // Corrected Param usage
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.paymentService.verifyPayment(reference, res);
  }

  @Roles(['cvWriter', 'linkdinOptimizer'])
  @Get('get-successful-orders/:productId')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  async getSuccessfulOrders(@Param('productId') productId: string, @Req() req: Request) {
    const userId = req.user.id;
    console.log(userId, productId);

    // Return the successful orders from the service
    return this.paymentService.getSuccessfulOrders(userId, productId);
  }


  @Get('user-orders')
  @UseGuards(AuthenticationGuard)
  getUserOrders(@Req() req: Request) {
    const userId = req.user.id
    return this.paymentService.getUserOrders(userId);
  }

  @Roles(['admin'])
  @Get('all-orders')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  getAllOrders(@Res() res: Response) {
    return this.paymentService.getAllOrders();
  }

  @Roles(['admin'])
  @Get('total-sales')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  getTotalSales(@Req() req: Request) {
    const userId = req.user.id
    return this.paymentService.getTotalSales(userId);
  }

  @Get('get-user-orders')
  @UseGuards(AuthenticationGuard)
  getUserOrder(@Req() req: Request) {
    const userId = req.user.id
    return this.paymentService.getUserOrder(userId);
  }
}
