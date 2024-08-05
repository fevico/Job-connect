import { Injectable, NotFoundException } from '@nestjs/common';
import { Referal } from './schema/referal.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Job } from 'src/job/schema/job.schema';
import { referCandidateMail } from 'src/utils/mail';
import { User } from 'src/user/schema/user.schema';

@Injectable()
export class ReferalService {
constructor(
    @InjectModel(Referal.name) private referalModel: Model<Referal>,
    @InjectModel(Job.name) private jobModel: Model<Job>,
    @InjectModel(User.name) private userModel: Model<User>,
){}

    async referCandidate(body: any, userId: string){
        const {jobId, candidateEmail, candidateName} = body

        const user = await this.userModel.findById(userId)
        if(!user){
            throw new NotFoundException('User does not exist')
        
        }
        //check if job exists
        const job = await this.jobModel.findById(jobId)
        if(!job){
            throw new NotFoundException('Job does not exist')
        }
       
        if( job.referal !== 'yes'){
            throw new NotFoundException('Job does not allow referal')
        }
        
        const referal = await this.referalModel.create({
            jobId,
            userId
        })
        referCandidateMail(candidateEmail, candidateName, jobId, job.title, job.location.state, job.companyName, job.description )
        return referal
    }

    async getAllReferrals(){
        const referal = await this.referalModel.find().populate('userId', '-password')
        return referal
    }

    async getMyReferrals(userId: string){
        const referal = await this.referalModel.find({userId}).populate('jobId', '-password')
        return referal
    }

    async getMyReferralCount(userId: string){
        return this.referalModel.find({userId}).countDocuments()
    }

    async getMyReferralEarnings(userId: string){
        return this.referalModel.find({userId}).populate('jobId', '-password')
    }

    async updateReferralStatus(body: any, userId: string) {
        const { referalId, referal, jobId, status } = body;
      
        const job = await this.jobModel.findById(jobId).exec();
        if (!job) throw new NotFoundException('Job does not exist');
        if (job.userId.toString() !== userId) throw new NotFoundException('You are not authorized to update this job');

        const user = await this.userModel.findById(userId).exec();
        if (!user) throw new NotFoundException('User does not exist');
      
        const referralExists = await this.referalModel.findOne({ userId: referal }).exec();
        if (!referralExists) throw new NotFoundException('Referral does not exist');
      
        const updatedReferral = await this.referalModel.findByIdAndUpdate(
          referalId,
          { status },
          { new: true } // This option returns the updated document
        ).exec();

        if(status === 'approved'){
            user.referalBalance = user.referalBalance + job.referalAmount
            await referralExists.save()

        }else{
            user.referalBalance = 0
            await referralExists.save()
            // job.referalCount = job.referalCount + 1
            // await job.save()
        }
      
        if (!updatedReferral) throw new NotFoundException('Failed to update referral');
      
        return updatedReferral;
      }      
}
