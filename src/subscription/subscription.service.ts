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
            const { customer, id: transactionId, reference, status, currency, amount,metadata,} = responseData.data;
  
            const { planName, email, userId } = metadata;
  
            // Determine subscription duration based on plan type
            let subscriptionEndDate = new Date();
            const currentDate = new Date();

            const user = await this.userModel.findById(userId);
            if (!user) {
              throw new NotFoundException('User not found');
            }
            const company = user.companyName;
  
            // Define durations based on the plan type
            switch(planName.toLowerCase()) {
              case 'basic':
                subscriptionEndDate = new Date(currentDate.setDate(currentDate.getDate() + 14)); // 14 days for Basic plan
                break;
              case 'standard':
                subscriptionEndDate = new Date(currentDate.setDate(currentDate.getDate() + 30)); // 30 days for Standard plan
                break;
              case 'premium':
                subscriptionEndDate = new Date(currentDate.setDate(currentDate.getDate() + 45)); // 45 days for Premium plan
                break;
              default:
                throw new Error('Invalid plan type');
            }

            const subscriptionExist = await this.subscriptionPaymentModel.findOne({ user: userId });
if (subscriptionExist) {
  // If subscription is still active, extend the current endDate
  const now = new Date();
  if (subscriptionExist.endDate > now) {
    subscriptionEndDate = new Date(subscriptionExist.endDate.getTime() + (subscriptionEndDate.getTime() - now.getTime()));
  }

  await this.subscriptionModel.findOneAndUpdate(
    { user: userId }, 
    { $set: { status: 'active', endDate: subscriptionEndDate } }
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
    email,
    paymentDate: new Date(),
    amountPaid: amount / 100,
    companyName: company,
    startDate: currentDate,
    endDate: subscriptionEndDate,
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
