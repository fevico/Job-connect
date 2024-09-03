import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from './schema/job.schema';
import { Model } from 'mongoose';
import { JobDto, UpdateJobDto } from './dto/job.dto';
import { User } from 'src/user/schema/user.schema';
import { AppliedJob } from './schema/appliedJob.schema';
import { Referal } from 'src/referal/schema/referal.schema';
import { hireApplicantMail } from 'src/utils/mail';


@Injectable()
export class JobService {
    constructor(
        @InjectModel(Job.name) private jobModel: Model<Job>, 
        @InjectModel(User.name) private userModel: Model<User>,  
        @InjectModel(AppliedJob.name) private appliedJobModel: Model<AppliedJob>,  
        // @InjectModel(Profile.name) private profileModel: Model<Profile>,  
        @InjectModel(Referal.name) private referalModel: Model<Referal>,  
    ) {}
    async createJob(jobDto: JobDto, userId: string): Promise<Job> {

        try {
            const user = await this.userModel.findById(userId);
        if (!user) throw new NotFoundException("User not found!");
        if (user.isVerified === false) throw new UnprocessableEntityException("Your account is not verified, please verify your account before you can create a job!");
        const createdJob = new this.jobModel({
            ...jobDto,
             userId: user._id,  // Assign the userId to the job
            companyName: user.companyName,
        });
        await createdJob.save()  
    
        return createdJob;
 
        } catch (error) {
            console.log(error)
            throw new BadRequestException(error.message) 
        }
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

 async applyJob(applyJobDto: any, userId: string) {
  const { id, resume } = applyJobDto;
  const job = await this.jobModel.findById(id);
  if (!job) throw new NotFoundException("Job not found!");

  if(job.status === "closed") throw new BadRequestException("Job has been closed!")

  const user = await this.userModel.findById(userId);
  if (!user) throw new NotFoundException("User not found!");
  
  const cv = resume || user.Cv;

  const cvDetails = user.Cv
  if(!cvDetails) throw new BadRequestException("Please upload your CV before applying for a job!")

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
    resume: cv,
    jobTitle: job.title, // Populate the job title
    companyName: job.companyName, // Populate the company name 
    name: user.name, // Populate the user's name
  });
  console.log(appliedJob)

  await appliedJob.save();

  return appliedJob;
}

      
    

    async getAppliedJobs(userId: string) {
        const appliedJobs = await this.appliedJobModel.find({ userId });
        if(!appliedJobs) throw new NotFoundException("No record for applied job!")

        
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
    

async hireApplicant(body: any, userId: string, jobId: string){
    const { id, applicantId } = body;
    
    // Check if the job exists and is owned by the user
    const jobExist = await this.jobModel.findOne({ _id: jobId, userId });
    if (!jobExist) throw new NotFoundException("Job not found or you do not own this job!");

    if(jobExist.status === "closed") throw new BadRequestException("Job has been closed!")
    
    // Check if the application exists for the given job and applicant
    const application = await this.appliedJobModel.findOne({ _id: id, userId: applicantId, jobId });
    if (!application) throw new NotFoundException("Application not found!");

    const user = await this.userModel.findById(applicantId);
    if (!user) throw new NotFoundException("User not found!");

    // Update the application status
    application.status = 'hired';
    await application.save();

    // If the status is 'hired', close the job
    if (application.status === 'hired') {
        jobExist.status = 'closed';
    }
    
    await jobExist.save();

    hireApplicantMail(user.email, user.name, jobExist.title, jobExist.companyName);
    
    return application;
}


    async getApplicationNumber(userId: string, jobId: any) {
        const job = await this.jobModel.findById(jobId)
        if(!job) throw new NotFoundException("Job not found!")

            const usersJob = await this.jobModel.findOne({userId})
            if(!usersJob) throw new UnauthorizedException("You don't have access to this job!")

        const applications = await this.appliedJobModel.findOne({jobId}).countDocuments({ jobId: jobId });
        if(!applications) throw new NotFoundException("Applications not found!")

            return applications
 
    }
}
