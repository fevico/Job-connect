import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import  moment from 'moment';
import { Model } from 'mongoose';
import { Subscription, SubscriptionDocument } from './schema/subcription.schema';
import { CreateSubscriptionDto } from './dto/subcription.dto';

@Injectable()
export class SubscriptionService {

    constructor(@InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>) {}

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
  
    async renewSubscription(subscription: SubscriptionDocument) {
      subscription.startDate = new Date();
      subscription.endDate = moment(subscription.startDate).add(1, 'month').toDate();
      subscription.status = 'active';
      return subscription.save();
    }
  
    async expireSubscription(subscription: SubscriptionDocument) {
      subscription.status = 'inactive';
      return subscription.save();
    }

    // async purchaseSubscription(body: string, userId: string){
    //   const {subcriptionId} = body
    //   const subscription = await this.subscriptionModel.findById(subcriptionId)
    //   if(subscription){
    //     const subscription = await this.subscriptionModel.findOne({userId: userId})
    //     if(subscription){
    //       await this.renewSubscription(subscription)
    //     }else{
    //       await this.createSubscription({userId: userId, subcriptionId: subcriptionId})
    //     }
    //   }
    // }
}
