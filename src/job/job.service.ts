import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from './schema/job.schema';
import { Model } from 'mongoose';
import { JobDto, UpdateJobDto } from './dto/job.dto';
import { User } from 'src/user/schema/user.schema';
import { AppliedJob } from './schema/appliedJob.schema';
import { Profile } from 'src/user/schema/profile.schema';
import { Referal } from 'src/referal/schema/referal.schema';

@Injectable()
export class JobService {
    constructor(
        @InjectModel(Job.name) private jobModel: Model<Job>, 
        @InjectModel(User.name) private userModel: Model<User>,  
        @InjectModel(AppliedJob.name) private appliedJobModel: Model<AppliedJob>,  
        @InjectModel(Profile.name) private profileModel: Model<Profile>,  
        @InjectModel(Referal.name) private referalModel: Model<Referal>,  
    ) {}

    async createJob(jobDto: JobDto, userId: string): Promise<Job> {
        const user = await this.userModel.findById(userId);
        if (!user) throw new NotFoundException("User not found!");
    
        const profile = await this.profileModel.findOne({ userId: userId });
        if (!profile) throw new BadRequestException("Please update your profile first!");
        if (!profile.companyName) throw new BadRequestException("Company name is required in the profile!");
    
        const createdJob = new this.jobModel({
            ...jobDto,
            userId: userId, // Assign the userId to the job
            companyName: profile.companyName,
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

    // async applyJob(applyJobDto: any, userId: string){
    //     try {
    //         const {id, coverLetter, resume} = applyJobDto
    //         const job = await this.jobModel.findById(id)
    //         if(!job) throw new NotFoundException("Job not found!")          
    
    //         const user = await this.userModel.findById(userId)
    //         if(!user) throw new NotFoundException("User not found!")
    //             const profile = await this.profileModel.findOne({userId: userId})
    //         if(!profile) throw new UnauthorizedException("Update your profile before you can appy for job!")
    
    //             const cv = resume || profile.CV;
    
    //             const appliedJob = new this.appliedJobModel({
    //                 jobId: id,
    //                 userId,
    //                 userEmail: user.email,
    //                 coverLetter,
    //                 resume: cv
    //             })
    //             await appliedJob.save()
    
    //         return appliedJob            
    //     } catch (error) {
    //         console.log(error)
    //         throw new NotFoundException("Error applying for job!", error)
    //     }

    // }

 async applyJob(applyJobDto: any, userId: string) {
  const { id, coverLetter, resume } = applyJobDto;
  const job = await this.jobModel.findById(id);
  if (!job) throw new NotFoundException("Job not found!");

  const user = await this.userModel.findById(userId);
  if (!user) throw new NotFoundException("User not found!");

  const profile = await this.profileModel.findOne({ userId: userId });
  if (!profile) throw new NotFoundException("Profile not found!");

  const cv = resume || profile.CV;

  if (!user.email) {
    throw new BadRequestException("User email is required to apply for a job");
  }

  // Check if the user has already applied for this job
  const existingApplication = await this.appliedJobModel.findOne({
    jobId: id,
    userId: userId,
  });
  if (existingApplication) {
    throw new BadRequestException("You have already applied for this job");
  }

  const appliedJob = new this.appliedJobModel({
    jobId: id,
    userId,
    userEmail: user.email,
    coverLetter,
    resume: cv,
    jobTitle: job.title, // Populate the job title
    companyName: job.companyName, // Populate the company name
    firstName: profile.firstName,
    lastName: profile.lastName,
  });

  await appliedJob.save();

  return appliedJob;
}

      
    

    async getAppliedJobs(userId: string) {
        const appliedJobs = await this.appliedJobModel.find({ userId });
        
        if (appliedJobs.length === 0) {
            throw new NotFoundException("No record for applied job!");
        }
    
        return appliedJobs;
    }

    async getApplicationsByJob(id: string){
        const job = await this.jobModel.findById(id)
        if(!job) throw new NotFoundException("Job not found!")

        const applications = await this.appliedJobModel.find({jobId: id})
        if(!applications) throw new NotFoundException("Applications not found!")

            return applications
    }

    async getEmployerApplication(userId: string) {
        const user = await this.userModel.findById(userId); 
        if (!user) throw new NotFoundException("User not found!");
    
        const applications = await this.jobModel.find({ userId: userId });
        if (applications.length === 0) throw new NotFoundException("Job application not found!");
    
        const employerApplications = await Promise.all(applications.map(async (application) => {
            const jobApplications = await this.appliedJobModel.find({ jobId: application._id });
            return {
                jobId: application._id,
                jobTitle: application.title,
                jobDescription: application.description,
                applications: jobApplications,
            };
        })
    );
        return employerApplications;
    
}
    async getEmployerApplications(body: any, userId: string) {
        const {id, status} = body
        const user = await this.userModel.findById(userId);
        if (!user) throw new NotFoundException("User not found!");
    
        const applications = await this.jobModel.findById({ id });
        if(!applications) throw new NotFoundException("Job application not found!")

        if(applications.referal !== 'yes') throw new ForbiddenException("You are not authorized to view this job application!")
            const updateJobStatus = await this.appliedJobModel.findOne({id})
            if(!updateJobStatus) throw new NotFoundException("Job application not found!")
                await updateJobStatus.updateOne({status})
                
                return updateJobStatus
    }

    async updateJob(jobDto: UpdateJobDto, userId: string){
        // const {id} = jobDto
        const user = await this.userModel.findById(userId);
        if (!user) throw new NotFoundException("User not found!");
        const jobExist = await this.jobModel.findOne({userId})
        if(!jobExist) throw new NotFoundException("No job for this user!")
            const updateJob = await this.jobModel.findByIdAndUpdate(jobDto.jobId, {jobDto})
        if(!updateJob) throw new UnprocessableEntityException("Cannot update job something went wrong!")
            return updateJob
    }

    async hireApplicant(body: any, userId: string, jobId: any){
        const {id, status} = body
        const jobExist = await this.jobModel.findById(jobId)
        if(!jobExist) throw new NotFoundException("Job not found!")
            const jobOwner = await this.jobModel.findOne({userId})
            if(!jobOwner) throw new NotFoundException("Job owner not found!")
            const updateJobStatus = await this.appliedJobModel.findOne({userId:id})
            if(!updateJobStatus) throw new NotFoundException("Job application not found!")
                
                await updateJobStatus.updateOne({status})
                if(status === 'hired'){
                    const updateUserStatus = await this.appliedJobModel.findByIdAndUpdate(id, {status: 'hired'})
                    if(!updateUserStatus) throw new UnprocessableEntityException("Cannot update user status something went wrong!")
                        jobExist.status = 'closed'
                        return updateUserStatus
                }
    }
}
