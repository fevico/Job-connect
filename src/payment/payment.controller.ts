import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request } from 'express';
import { AuthenitcationGuard } from 'src/guards/auth.guard';

@Controller('payment')
export class PaymentController {
    constructor(private paymentService: PaymentService ){}
    @UseGuards(AuthenitcationGuard)
    @Post('create-payment-intent')
    createPaymentIntent(@Body() body: any, @Req() req: Request){
        const userId = req.user.id
        return this.paymentService.createPaymentIntent(body, userId);
    }

    @Get('verify-payment/:id')
    verifyPayment( @Param('id') id: string, @Req() req: Request){
        // console.log(req.query)
        const userId = req.user.id
        return this.paymentService.verifyPayment(id, userId);
    }
}
