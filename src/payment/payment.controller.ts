import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request } from 'express';
import { AuthenitcationGuard } from 'src/guards/auth.guard';

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
}
