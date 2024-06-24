import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from './schema/job.schema';
import { Model } from 'mongoose';
import { JobDto } from './dto/job.dto';
import { User } from 'src/user/schema/user.schema';

@Injectable()
export class JobService {
    constructor(
        @InjectModel(Job.name) private jobModel: Model<Job>, 
        @InjectModel(User.name) private userModel: Model<User>,   
    ) {}

    async createJob(jobDto: JobDto, userId: string): Promise<Job> {
        const createdJob = new this.jobModel({
          ...jobDto,
          userId: userId, // Assign the userId to the job
        });
        return createdJob.save();
      }

    async getAllJobs(){ 
        const jobs = await this.jobModel.find();
        if(!jobs) throw new NotFoundException("Jobs not found!")
            return jobs
    }

    async getJobById(id: string){
        const job = await this.jobModel.findById(id);
        if(!job) throw new NotFoundException("Job not found!")
            return job
    }

    async getJobsByEmployer(id: string, userId: string){
        const user = await this.userModel.findById(userId)
        if(!user) throw new NotFoundException("User not found!")

        const jobs = await this.jobModel.find({userId: id})
        if(!jobs) throw new NotFoundException("Jobs not found!") 

            return jobs
    }
}
