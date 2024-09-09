import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as https from 'https';
import { Payment } from './schema/payment.schema';
import { Model } from 'mongoose';
import { Wallet } from 'src/wallet/shema/wallet.schema';
import { newOrder, successfulPayment } from 'src/utils/mail';
import { Product } from 'src/product/schema/product.schema';
import { User } from 'src/user/schema/user.schema';

@Injectable()
export class PaymentService {
    constructor(
        @InjectModel(Payment.name) private paymentModel: Model<Payment>, 
        @InjectModel(Wallet.name) private walletModel: Model<Wallet>, 
        @InjectModel(Product.name) private productModel: Model<Product>, 
        @InjectModel(User.name) private userModel: Model<User>, 
    ){}

  async createPaymentIntent(body: any, res: any) {
    const { amount, email, metadata } = body;

    const params = JSON.stringify({
      email,
      amount,
      metadata,
      callback_url: 'http://localhost:5173/',
      // metadata,
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
           res.send(data);
           console.log(data)
        });
      })
      .on('error', (error) => {
        console.error(error);
      });

    reqPaystack.write(params);
    reqPaystack.end();
  }

  async verifyPayment(reference: string, res: any) {
    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: `/transaction/verify/${reference}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    };
  
    const reqPaystack = https.request(options, (respaystack) => {
      let data = '';
  
      respaystack.on('data', (chunk) => {
        data += chunk;
      });
  
      respaystack.on('end', async () => {
        try {
          const responseData = JSON.parse(data);
  
          // Log the entire response from Paystack for debugging
  
          if (
            responseData.status === true
            // responseData.data.status === 'success'
          ) {
            const { customer, id, reference, status, currency, metadata } =
              responseData.data;
            const totalPrice = parseFloat(metadata.totalPrice);
            const eightyPercent = totalPrice * 0.8;
            const twentyPercent = totalPrice * 0.2;
            console.log(totalPrice, eightyPercent, twentyPercent)
  
            const paymentData = {
              referenceId: reference,
              email: customer.email,
              status,
              currency,
              name: metadata.customerName,
              transactionId: id,
              phone: metadata.phone,
              totalPrice: totalPrice, // Save the full total price here
              userId: metadata.userId,
              productId: metadata.productId,
            };
  
            // Save the payment details
            await this.paymentModel.create(paymentData);
  
            // Create or update the wallet balance with the 80% amount
            let wallet = await this.walletModel.findOne({
              owner: metadata.userId,
            });
            if (wallet) {
              wallet.balance += eightyPercent;
              await wallet.save();
            } else {
              wallet = await this.walletModel.create({
                owner: metadata.userId,
                balance: eightyPercent,
              });
            }
  
            // const adminBalance = await this.walletModel.findOne({
            //   userId: '6476f4f5c8d8e5a6b7c8d9e0',
            // });
            // if (adminBalance) {
            //   adminBalance.balance += twentyPercent;
            //   await adminBalance.save();
            // }
            const product = await this.productModel.findById(metadata.productId).populate('userId');
            if(!product) throw new NotFoundException('Product not found')
              const user = await this.userModel.findById(metadata.userId);
            if(!user) throw new NotFoundException('User not found')

              const users = product.userId as any;


            successfulPayment(responseData.data.customer.email, product.type, totalPrice, user.name);
            newOrder(users.email, product.type, users.name)
            return res.json({
              status: true,
              message: 'Payment verified successfully',
              data: responseData,
            });

          }else {
            // If payment verification failed, log the error and send an error response
            console.log('Transaction verification failed:', responseData);
            return res.status(400).json({
              status: false, 
              message: 'Transaction verification failed.',
            });
          }
        } catch (error) {
          console.error('Error parsing response:', error);
          return res.status(500).json({ status: false, message: 'Server error.' });
        }
      });
    });
  
    reqPaystack.on('error', (error) => {
      console.error('Error with Paystack request:', error);
      res.status(500).json({ status: false, message: 'Server error.' });
    });
  
    reqPaystack.end();
  }

  async getSuccessfulOrders(userId: string) {
    // Find all products associated with the user
    const products = await this.productModel.find({ userId });
    if (!products || products.length === 0) {
        throw new NotFoundException('No products found for this user!');
    }

    // Extract product IDs from the found products
    const productIds = products.map(product => product._id);

    // Find successful orders for these products
    const successfulOrders = await this.paymentModel.find({
        productId: { $in: productIds },
        status: 'successful', // Assuming 'successful' is the status for a completed order
    });

    if (!successfulOrders || successfulOrders.length === 0) {
        throw new NotFoundException('No successful orders found for this user!');
    }

    return successfulOrders;
}


async getUserOrders(userId: string) {
  const user = await this.userModel.findById(userId);
  if (!user) {
    throw new NotFoundException('User not found');
  }

  const orders = await this.paymentModel.find({ userId }).populate('productId');
  if (!orders || orders.length === 0) {
    throw new NotFoundException('No orders found for this user');
  }

  return orders;
}
  
async getAllOrders(){
  const orders = await this.paymentModel.find().populate('productId');
  if (!orders || orders.length === 0) {
    throw new NotFoundException('No orders found');
  }

  return orders;
}
  
  }