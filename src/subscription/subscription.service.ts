import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import  moment from 'moment';
import { Model } from 'mongoose';
import { Subscription, SubscriptionDocument } from './schema/subcription.schema';
import { CreateSubscriptionDto } from './dto/subcription.dto';
import * as https from 'https';
import { User } from 'src/user/schema/user.schema';
import { SubscriptionPayment } from './schema/subscriptionPayment';


@Injectable()
export class SubscriptionService {
 
    constructor(
      @InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>,
      @InjectModel(SubscriptionPayment.name) private subscriptionPaymentModel: Model<SubscriptionPayment>,
      @InjectModel(User.name) private userModel: Model<User>,
    ) {}

    async createSubscription(createSubscriptionDto: CreateSubscriptionDto): Promise<Subscription> {
      const startDate = new Date();
      const endDate = moment(startDate).add(1, 'month').toDate(); // Add one month to start date
  
      const subscription = new this.subscriptionModel({
        ...createSubscriptionDto,
        startDate,
        endDate,
        status: 'active',
      });
      return subscription.save();
    }
  
    async findAllActive(): Promise<Subscription[]> {
      return this.subscriptionModel.find({ status: 'active' }).exec();
    }

    
  async purchaseSubscription(body: any, res: any) {
    const { amount, email, metadata } = body;

    const params = JSON.stringify({
      email,
      amount,
      metadata,
      // callback_url: 'https://jobkonnecta.com/subscription',
      callback_url: 'http://localhost:5173/subscription',
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

  async verifySubscriptionPayment(reference: string, res: any) {
    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: `/transaction/verify/${reference}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
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
  
          if (responseData.status === true && responseData.data.status === 'success') {
            const { customer, id: transactionId, reference, status, currency, amount, metadata } = responseData.data;
            const { planName, userId } = metadata;
  
            const user = await this.userModel.findById(userId);
            if (!user) {
              throw new NotFoundException('User not found');
            }
            const company = user.companyName;
  
            // Calculate subscription end date (one month from current date)
            const currentDate = new Date();
            let subscriptionEndDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
  
            // Determine job posting limits based on plan type
            let freeJobLimit = 1;  // 1 free job per month for all plans
            let paidJobLimit;      // Additional jobs limit based on plan
  
            switch (planName.toLowerCase()) {
              case 'basic':
                paidJobLimit = 3;  // Basic plan allows 3 additional jobs per month
                break;
              case 'standard':
                paidJobLimit = 5;  // Standard plan allows 5 additional jobs per month
                break;
              case 'premium':
                paidJobLimit = 10;  // Premium plan allows 10 additional jobs per month
                break;
              default:
                throw new Error('Invalid plan type');
            }
  
            // Check if the user already has an active subscription
            const subscriptionExist = await this.subscriptionPaymentModel.findOne({ user: userId });
            if (subscriptionExist) {
              // If subscription is still active, extend the current endDate
              const now = new Date();
              if (subscriptionExist.endDate > now) {
                subscriptionEndDate = new Date(subscriptionExist.endDate.getTime() + (subscriptionEndDate.getTime() - now.getTime()));
              }
  
              await this.subscriptionModel.findOneAndUpdate(
                { user: userId },
                { 
                  $set: { 
                    status: 'active', 
                    endDate: subscriptionEndDate, 
                    paidJobLimit, 
                    freeJobLimit,
                    freeJobCount: 0 // Reset free job count at the start of the month
                  } 
                }
              );
            } else {
              // If no existing subscription, create a new one
              const paymentData = new this.subscriptionPaymentModel({
                user: userId,
                transactionId,
                referenceId: reference,
                paymentStatus: status,
                currency,
                planName,
                email: customer.email,
                paymentDate: new Date(),
                amountPaid: amount / 100,
                companyName: company,
                startDate: currentDate,
                endDate: subscriptionEndDate,
                paidJobLimit,  // Assign job posting limit
                freeJobLimit,  // Assign free job limit
                freeJobCount: 0 // Initialize free job count
              });
  
              await paymentData.save();
            }
  
            // Send success response to the user
            return res.status(200).json({
              status: true,
              message: `Subscription for ${planName} plan successfully activated.`,
              data: {
                subscriptionEndDate,
                planName,
                paidJobLimit,
                freeJobLimit,
              },
            });
          } else {
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
  
  

}
