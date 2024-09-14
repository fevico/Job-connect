import { Injectable } from '@nestjs/common';
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
      @InjectModel(User.name) private userModel: Model<User>
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
  
    // async renewSubscription(subscription: SubscriptionDocument) {
    //   subscription.startDate = new Date();
    //   subscription.endDate = moment(subscription.startDate).add(1, 'month').toDate();
    //   subscription.status = 'active';
    //   return subscription.save();
    // }
  
    async expireSubscription(subscription: SubscriptionDocument) {
      subscription.status = 'inactive';
      return subscription.save();
    }

    
  async purchaseSubscription(body: any, res: any) {
    const { amount, email, metadata } = body;

    const params = JSON.stringify({
      email,
      amount,
      metadata,
      callback_url: 'https://jobkonnecta.com/',
      // callback_url: 'http://localhost:5173/',
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
            const {
              customer,
              id: transactionId,
              reference,
              status,
              currency,
              amount,
              metadata,
            } = responseData.data;

            const { plan, userId, companyName } = metadata;

            // Determine subscription duration based on plan type
            let subscriptionEndDate = new Date();
            const currentDate = new Date();

            if (plan === 'monthly') {
              subscriptionEndDate.setMonth(currentDate.getMonth() + 1); // Add 1 month
            } else if (plan === 'yearly') {
              subscriptionEndDate.setFullYear(currentDate.getFullYear() + 1); // Add 1 year
            } else {
              return res.status(400).json({ status: false, message: 'Invalid subscription plan.' });
            }

            // Update the user's subscription status
            await this.userModel.updateOne(
              { email: customer.email },
              {
                isSubscribed: true,
                subscriptionEndDate,
                currentPlan: plan,
              }
            );

            // Save the payment details in the Subscription schema
            const paymentData = new this.subscriptionPaymentModel({
              userId, // Assuming email is used as user ID here; use actual user ID if available
              transactionId,
              referenceId: reference,
              status,
              currency,
              plan, // Monthly or yearly
              paymentDate: new Date(),
              amount: amount / 100, // Assuming Paystack amount is in kobo (100 kobo = 1 NGN)
              companyName,
              email: customer.email,
            });

            await paymentData.save();

            // Send success response to the user
            return res.status(200).json({
              status: true,
              message: `Subscription for ${plan} plan successfully activated.`,
              data: {
                subscriptionEndDate,
                plan,
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
