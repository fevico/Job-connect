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
  ) { }

  async createPaymentIntent(body: any, res: any) {
    const { amount, email, metadata } = body;

    const params = JSON.stringify({
      amount,
      email,
      metadata,
      // callback_url: 'https://jobkonnecta.com/',
      callback_url: 'http://localhost:5173/',
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
            responseData.status === true && responseData.data.status === 'success'
          ) {
            const { customer, id, reference, status, currency, metadata, paidAt } =
              responseData.data;
            const totalPrice = parseFloat(metadata.packagePrice) * 0.01;
            const eightyPercent = totalPrice * 0.8;
            const twentyPercent = totalPrice * 0.2;

            const paymentData = {
              referenceId: reference,
              email: customer.email,
              status,
              currency,
              name: metadata.fullName,
              transactionId: id,
              phone: metadata.phone,
              userId: metadata.userId,
              productId: metadata.productId,
              workExperience: metadata.workExperience,
              professionalSummary: metadata.professionalSummary,
              education: metadata.education,
              skills: metadata.skills,
              packageTitle: metadata.packageTitle,
              packagePrice: totalPrice,
              vendorId: metadata.vendorId,
              paidAt,
              linkedinUrl: metadata.linkedinUrl,
              resume: metadata.Cv,
            };

            // Save the payment details
            await this.paymentModel.create(paymentData);


            let wallet = await this.walletModel.findOne({
              owner: metadata.vendorId,
            });

            if (wallet) {
              // If the vendor already has a wallet, update the balance
              wallet.balance += eightyPercent;
              wallet.transactions.push({
                amount: eightyPercent,
                totalAmount: 0,

                date: new Date(),
              });
              await wallet.save();
            } else {
              // If the vendor does not have a wallet, create it
              wallet = await this.walletModel.create({
                owner: metadata.vendorId,
                balance: eightyPercent,
                transactions: [{
                  amount: eightyPercent, totalAmount: 0,
                  date: new Date()
                }],
              });
            }

            // Find all admin accounts
            const adminAccounts = await this.userModel.find({ role: 'admin' });

            if (!adminAccounts || adminAccounts.length === 0) {
              throw new NotFoundException('No admin accounts found');
            }

            // For each admin, update the wallet
            for (const admin of adminAccounts) {
              let adminWallet = await this.walletModel.findOne({
                owner: admin._id,
              });

              if (adminWallet) {
                // If the admin already has a wallet, update the balance and totalSales
                adminWallet.balance += twentyPercent;
                adminWallet.totalSales += totalPrice;
                adminWallet.transactions.push({
                  amount: twentyPercent,
                  totalAmount: totalPrice,
                  date: new Date(),
                });
                await adminWallet.save();
              } else {
                // If the admin does not have a wallet, create it
                adminWallet = await this.walletModel.create({
                  owner: admin._id,
                  balance: twentyPercent,
                  totalSales: totalPrice,
                  transactions: [{ amount: twentyPercent, totalAmount: totalPrice, date: new Date() }],
                });
              }
            }

            const user = await this.userModel.findById(metadata.userId);
            if (!user) throw new NotFoundException('User not found')

            const vendor = await this.userModel.findById(metadata.vendorId);
            if (!user) throw new NotFoundException('User not found')

            // const users = product.userId as any;


            successfulPayment(responseData.data.customer.email, vendor.role, totalPrice, user.name);
            newOrder(vendor.email, vendor.role, vendor.name)
            return res.json({
              status: true,
              message: 'Payment verified successfully',
              data: responseData,
            });

          } else {
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

  async getSuccessfulOrders(userId: string, productId: string) {
    // Find the specific product by productId and userId
    const product = await this.productModel.findOne({ _id: productId, userId });
    if (!product) {
      throw new NotFoundException('Product not found or does not belong to the user!');
    }

    // Find successful orders for this specific product
    const successfulOrders = await this.paymentModel.find({
      productId: product._id,
      status: 'success', // Assuming 'success' is the status for a completed order
    });

    if (!successfulOrders || successfulOrders.length === 0) {
      throw new NotFoundException('No successful orders found for this product!');
    }

    // Return the successful orders
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

  async getAllOrders() {
    const orders = await this.paymentModel.find().populate('productId');
    if (!orders || orders.length === 0) {
      throw new NotFoundException('No orders found');
    }

    return orders;
  }

  async getTotalSales(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const wallet = await this.walletModel.findOne({ owner: userId });
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return wallet;
  }

  async getUserOrder(userId:string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const order = await this.paymentModel.findOne({userId});
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return {order: {status: order.serviceStatus, amount: order.packagePrice, productName: order.packageTitle, paidAt: order.paidAt}};

  }

}