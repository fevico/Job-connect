import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Plans } from './schema/plans.shema';
import { Model } from 'mongoose';

@Injectable()
export class PlansService {
    constructor(
        @InjectModel(Plans.name) private plansModel: Model<Plans>
    ){}

    async createPlan(body: any){
        const plan = this.plansModel.create(body);
        return plan;
    }

    async updatePlan(body: any){
        const plan = await this.plansModel.findByIdAndUpdate(body.id, body, {new: true});
        return plan;
    }

    async getPlans(){
        const plans = await this.plansModel.find()
        return plans
    }

    async getPlansById(id: string){
        const plan = await this.plansModel.findById(id)
        return plan
    }

    async deletePlan(body: any){
        const plan = await this.plansModel.findByIdAndDelete(body.id)
        return plan
    }
}
