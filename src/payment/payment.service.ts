import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as https from 'https';
import { Payment } from './schema/payment.schema';
import { Model } from 'mongoose';
import { Wallet } from 'src/wallet/shema/wallet.schema';

@Injectable()
export class PaymentService {
    constructor(
        @InjectModel(Payment.name) private paymentModel: Model<Payment>, 
        @InjectModel(Wallet.name) private walletModel: Model<Wallet>, 
    ){}

  async createPaymentIntent(body: any, userId: string) {
    const { amount, email, metadata } = body;

    const params = JSON.stringify({
      email,
      amount,
      callback_url: 'https://ekomas-react-new.vercel.app/',
      metadata,
    });

    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: '/transaction/initialize',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    };

    const reqPaystack = https
      .request(options, (respaystack) => {
        let data = '';

        respaystack.on('data', (chunk) => {
          data += chunk;
        });

        respaystack.on('end', () => {
          console.log(JSON.parse(data));
          // Assuming res is the response object from the caller context
          // res.send(data);
        });
      })
      .on('error', (error) => {
        console.error(error);
      });

    reqPaystack.write(params);
    reqPaystack.end();
  }

  async verifyPayment(id: string, userId: string) {
    // const reference = req.query.reference;
    // console.log(reference);
    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      //   path: `/transaction/verify/${reference}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    };

    const reqPaystack = https.request(options, async (respaystack) => {
      let data = '';
    
      respaystack.on('data', (chunk) => {
        data += chunk;
      });
    
      respaystack
        .on('end', async () => {
          const responseData = JSON.parse(data);
    
          // Check if payment was successful
          if (
            responseData.status === true &&
            responseData.data.status === 'success'
          ) {
            // Payment was successful, extract relevant information
            const { customer, id, reference, status, currency, metadata } = responseData.data;
    
            const paymentData = {
              referenceId: reference,
              email: customer.email,
              status,
              currency,
              name: metadata.customerName,
              transactionId: id,
              phone: metadata.phone,
              totalPrice: metadata.totalPrice,
              userId: metadata.customerId,
            };
    
            // Calculate 80% and 20% of the total price
            const totalPrice = parseFloat(metadata.totalPrice);
            const eightyPercent = totalPrice * 0.8;
            const twentyPercent = totalPrice * 0.2;
    
            // Update the paymentData to include the 80% and 20% values
            paymentData.totalPrice = eightyPercent;
            paymentData.totalPrice = twentyPercent;
    
            console.log(paymentData); 
    
            // Save the payment details
            const paymentDetails = await this.paymentModel.create(paymentData);
    
            // Create or update the wallet balance with the 80% amount
            let wallet = await this.walletModel.findOne({ userId: metadata.customerId });
            if (wallet) {
              wallet.balance += eightyPercent;
              await wallet.save();
            } else {
              wallet = await this.walletModel.create({
                userId: metadata.customerId,
                balance: eightyPercent,
              });
            }
    
            // Save the 20% amount separately (e.g., for a commission account or another use case)
            // await this.commissionModel.create({
            //   userId: metadata.customerId,
            //   amount: twentyPercent,
            //   referenceId: reference,
            // });
    
            reqPaystack.end();
          }
        })
        .on('error', (error) => {
          console.error(error);
        });
    });
    
  }
}
