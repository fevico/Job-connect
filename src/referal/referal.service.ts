import { Injectable, NotFoundException } from '@nestjs/common';
import { Referal } from './schema/referal.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Job } from 'src/job/schema/job.schema';
import { referCandidateMail } from 'src/utils/mail';
import { User } from 'src/user/schema/user.schema';
import { ReferralDto } from './dto/referral.dto';

@Injectable()
export class ReferalService {
  constructor(
    @InjectModel(Referal.name) private referralModel: Model<Referal>,
    @InjectModel(Job.name) private jobModel: Model<Job>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async referCandidate(body: ReferralDto, userId: string) {
    const { jobId, candidateEmail, candidateName } = body;

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    //check if job exists
    const job = await this.jobModel.findById(jobId);
    if (!job) {
      throw new NotFoundException('Job does not exist');
    }

    if (job.referral !== 'yes') {
      throw new NotFoundException('Job does not allow referral');
    }

    const referral = await this.referralModel.create({
      ...body,
      userId,
    });
    referCandidateMail(
      candidateEmail,
      candidateName,
      jobId,
      job.title,
      job.location.state,
      job.companyName,
      job.description,
    );
    return referral;
  }

  async getAllReferrals() {
    const referral = await this.referralModel
      .find()
      .populate('userId', '-password');
    return referral;
  }

  async getMyReferrals(userId: string) {
    const referral = await this.referralModel
      .find({ userId })
      .populate('jobId', '-password');
    return referral;
  }

  async getMyReferralCount(userId: string) {
    return this.referralModel.find({ userId }).countDocuments();
  }

  async getMyReferralEarnings(userId: string) {
    return this.referralModel.find({ userId }).populate('jobId', '-password');
  }

  // async updateReferralStatus(body: any, userId: string) {
  //     const { referalId, referal, jobId, status } = body;

  //     const job = await this.jobModel.findById(jobId).exec();
  //     if (!job) throw new NotFoundException('Job does not exist');
  //     if (job.userId.toString() !== userId) throw new NotFoundException('You are not authorized to update this job');

  //     const user = await this.userModel.findById(userId).exec();
  //     if (!user) throw new NotFoundException('User does not exist');

  //     const referralExists = await this.referalModel.findOne({ userId: referal }).exec();
  //     if (!referralExists) throw new NotFoundException('Referral does not exist');

  //     const updatedReferral = await this.referalModel.findByIdAndUpdate(
  //       referalId,
  //       { status },
  //       { new: true } // This option returns the updated document
  //     ).exec();

  //     if(status === 'approved'){
  //         user.referalBalance = user.referalBalance + job.referalAmount
  //         await referralExists.save()

  //     }else{
  //         user.referalBalance = 0
  //         await referralExists.save()
  //         // job.referalCount = job.referalCount + 1
  //         // await job.save()
  //     }

  //     if (!updatedReferral) throw new NotFoundException('Failed to update referral');

  //     return updatedReferral;
  //   }
  
  async getReferralJob() {
    // Find all referrals and populate the user's name
    const referrals = await this.referralModel
      .find()
      .populate<{ userId: { name: string } }>({ path: 'userId', select: 'name' });
  
    if (!referrals || referrals.length === 0) {
      throw new NotFoundException('No referral found');
    }
      // Map the referrals to include the user name
    const result = referrals.map((referral) => ({
      referral,
      referredBy: referral.userId.name,
    }));
  
    return result;
  }
  
}
