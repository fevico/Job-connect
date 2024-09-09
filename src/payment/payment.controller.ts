import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request } from 'express';
import { AuthenitcationGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorator/role.decorator';
import { AuthorizationGuard } from 'src/guards/authorization.guard';

@Controller('payment')
export class PaymentController {
    constructor(private paymentService: PaymentService ){}
    // @UseGuards(AuthenitcationGuard)
    @Post('create-payment')
    createPaymentIntent(@Body() body: any, @Req() req: Request, @Res() res: any){
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

    @Roles(['cvwriter', 'linkdinOptimizer'])
    @Get('get-successful-orders:/productId')
    @UseGuards(AuthenitcationGuard, AuthenitcationGuard)
    getSuccessfulOrders(@Param('productId') productId: string, @Req() req: Request, @Res() res: Response){
      const userId = req.user.id
        return this.paymentService.getSuccessfulOrders(userId, productId);
    }

    @Get('user-orders')
    @UseGuards(AuthenitcationGuard)
    getUserOrders(@Req() req: Request, @Res() res: Response){
        const userId = req.user.id
        return this.paymentService.getUserOrders(userId);
    }

    @Roles(['admin'])
    @Get('all-orders')
    @UseGuards(AuthenitcationGuard, AuthorizationGuard)
    getAllOrders(@Res() res: Response){
        return this.paymentService.getAllOrders();
    }
}
