import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from './schema/job.schema';
import { Model } from 'mongoose';
import { JobDto, UpdateJobDto } from './dto/job.dto';
import { JobSeeker, User } from 'src/user/schema/user.schema';
import { AppliedJob } from './schema/appliedJob.schema';
import { Referal } from 'src/referal/schema/referal.schema';
import { hireApplicantMail, rejectedMail, shortlistMail } from 'src/utils/mail';
import { SubscriptionPayment } from 'src/subscription/schema/subscriptionPayment';


@Injectable()
export class JobService {
    constructor(
        @InjectModel(Job.name) private jobModel: Model<Job>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(AppliedJob.name) private appliedJobModel: Model<AppliedJob>,
        @InjectModel(Referal.name) private referralModel: Model<Referal>,
        @InjectModel(SubscriptionPayment.name) private subscriptionPaymentModel: Model<SubscriptionPayment>,
    ) { }

    async createJob(jobDto: JobDto, userId: string): Promise<Job> {
        try {
          console.log(userId);
      
          const user = await this.userModel.findOne({ _id: userId });

      
          // Check if user exists
          if (!user) throw new NotFoundException("User not found!");
      
          // Check if user is verified
          if (!user.isVerified) {
            throw new UnprocessableEntityException("Your account is not verified. Please verify your account before you can create a job!");
          }
      
          let subscription = null;          
      
          // Check if user is neither 'admin' nor 'jobPoster'
          if (user.role !== 'admin' && user.role !== 'jobPoster') {
            subscription = await this.subscriptionPaymentModel.findOne({
              user: userId,
              status: 'active',
              endDate: { $gte: new Date() }, // Ensure subscription is still active
            });
      
            // Free Job Posting Logic
            if (subscription) {
              const currentDate = new Date();
              const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      
              // Check if user has already posted the free job for the current month
              if (subscription.freeJobCount < 1) {
                // Free job available, allow posting the free job
                subscription.freeJobCount += 1; // Increment free job count for the month
              } else {
                // No free jobs left, check for remaining paid job posts
                if (subscription.paidJobLimit <= 0) {
                  throw new UnprocessableEntityException('No remaining job posts in your subscription.');
                }
      
                // Deduct one from the remaining paid jobs
                subscription.paidJobLimit -= 1;
              }
            } else {
              throw new UnprocessableEntityException('Subscription is not active or has expired.');
            }
      
            // Save subscription changes (updated freeJobCount or paidJobLimit)
            await subscription.save();
          }
      
          // Proceed with job creation
          const createdJob = new this.jobModel({
            ...jobDto,
            userId: user._id, // Assign the userId to the job
            expiresAt: subscription ? subscription.endDate : null, // Set expiration if applicable
          });
          const isFeatured = user.role === 'admin' || user.role === 'jobPoster';
          if(isFeatured) createdJob.isFeatured = true;
      
          await createdJob.save();
          return createdJob;
      
        } catch (error) {
          console.log(error);
          throw new BadRequestException(error.message || 'Failed to create job');
        }
      }
      

      async getAllJobs() {
        const jobs = await this.jobModel.find().sort({ _id: -1 }); // Sort by _id in descending order
        if (!jobs || jobs.length === 0) throw new NotFoundException("Jobs not found!");
        return jobs;
    }
    

    async getJobById(id: string) {
        const job = await this.jobModel.findById(id);
        if (!job) throw new NotFoundException("Job not found!")
        return job
    }

    async getJobsByEmployer(id: string, userId: string) {
        const user = await this.userModel.findById(userId)
        if (!user) throw new NotFoundException("User not found!")

        const jobs = await this.jobModel.find({ userId: id })
        if (!jobs) throw new NotFoundException("Jobs not found!")


        return jobs
    }

    async applyJob(applyJobDto: any, userId: string) {
      const { id, resume } = applyJobDto;
      const job = await this.jobModel.findById(id);
      if (!job) throw new NotFoundException("Job not found!");
  
      if (job.status === "closed") throw new BadRequestException("Job has been closed!");
  
      const user = await this.userModel.findById(userId) as JobSeeker;
  
      if (!user) throw new NotFoundException("User not found!");
  
      const cv = resume || user.cv;
      const cvDetails = user.cv;

      const linkedIn = user.linkedInProfile || "Not provided"
      
      if (!cvDetails) throw new BadRequestException("Please upload your CV before applying for a job!");
  
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
  
      // Create and save the applied job record
      const appliedJob = new this.appliedJobModel({
          jobId: id,
          userId,
          userEmail: user.email,
          resume: cv,
          jobTitle: job.title,
          companyName: job.companyName,
          name: user.name,
          linkedIn
      });
  
      await appliedJob.save();
  
      // Check if the user was referred for this job
      const referral = await this.referralModel.findOne({
          jobId: id,
          referredEmail: user.email,
      });
  
      if (referral) {
          // Update referral status to "processing" when the user applies
          referral.status = 'processing';
          await referral.save();
      }
  
      return appliedJob;
  }
  

    async getAppliedJobs(userId: string) {
        const appliedJobs = await this.appliedJobModel.find({ userId });
        if (!appliedJobs) throw new NotFoundException("No record for applied job!")


        if (appliedJobs.length === 0) {
            throw new NotFoundException("No record for applied job!");
        }

        return appliedJobs;
    }

    async getApplicationsByJob(id: string) {
        const job = await this.jobModel.findById(id)
        if (!job) throw new NotFoundException("Job not found!")

        const applications = await this.appliedJobModel.find({ jobId: id })
        if (!applications) throw new NotFoundException("Applications not found!")

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

    async hireApplicant(body: any, userId: string, jobId: string) {
      const { id, applicantId, referredEmail } = body;
  
      // Check if the job exists and is owned by the user
      const jobExist = await this.jobModel.findOne({ _id: jobId, userId });
      if (!jobExist) throw new NotFoundException("Job not found or you do not own this job!");
  
      // Ensure job is not closed
      if (jobExist.status === "closed") throw new BadRequestException("Job has been closed!");
  
      // Check if the application exists for the given job and applicant
      const application = await this.appliedJobModel.findOne({ _id: id, userId: applicantId, jobId });
      if (!application) throw new NotFoundException("Application not found!");
  
      // Check if the applicant (user) exists
      const user = await this.userModel.findById(applicantId);
      if (!user) throw new NotFoundException("User not found!");
  
      // Update the application status to 'hired'
      application.status = 'hired';
      await application.save();
  
      // If the status is 'hired', close the job
      jobExist.status = 'closed';
      await jobExist.save();
  
      // Check if the referredEmail exists in the referral system
      const referral = await this.referralModel.findOne({ referredEmail });
  
      if (referral) {
          // Find the user who referred the applicant
          const referrer = await this.userModel.findById(referral.referredBy) as JobSeeker;
  
          if (referrer) {
              // Add the referral bonus to the referrer's balance (if you have a field like `referralBalance`)
              await this.userModel.findOneAndUpdate(
                { _id: referral.referredBy },
                { $inc: { referralBalance: jobExist.referralAmount } }
              );              
  
              // Optionally, you can also update the referral status to show that it has been rewarded
              referral.status = 'approved';
              await referral.save();
          }
      }
  
      // Send an email to the hired applicant (trigger the email function)
      hireApplicantMail(user.email, user.name, jobExist.title, jobExist.companyName);
  
      // Return the updated application
      return application;
  }
  

    async getApplicationNumber(userId: string, jobId: any) {
        const job = await this.jobModel.findById(jobId)
        if (!job) throw new NotFoundException("Job not found!")

        const usersJob = await this.jobModel.findOne({ userId })
        if (!usersJob) throw new UnauthorizedException("You don't have access to this job!")

        const applications = await this.appliedJobModel.findOne({ jobId }).countDocuments({ jobId: jobId });
        if (!applications) throw new NotFoundException("Applications not found!")

        return applications

    }

    // async shortlistJob(applicationId: string, body: any) {
    //     const { userId, jobId } = body;

    //     const job = await this.jobModel.findById(jobId);
    //     if (!job) throw new NotFoundException("Job not found!");

    //     const application = await this.appliedJobModel.findById(applicationId);
    //     if (!application) throw new NotFoundException("Application not found for this user!");

    //     const user = await this.userModel.findById(userId);
    //     if (!user) throw new NotFoundException("User not found!");

    //     application.status = 'shortlisted';
    //     await application.save();

    //     // Send email to the applicant
    //     rejectedMail(user.email, user.name, job.title, job.companyName);

    //     return { message: "Application shortlisted successfully!" };
    // }

    async shortlistApplicant(applicationId: string, body:any) {
      const { userId, jobId } = body;
      
      const job = await this.jobModel.findById(jobId);
      if (!job) throw new NotFoundException("Job not found!");

      const application = await this.appliedJobModel.findById(applicationId);
      if (!application) throw new NotFoundException("Application not found!");
  
      application.status = 'shortlisted';
      await application.save();

      const user = await this.userModel.findById(userId);
      if (!user) throw new NotFoundException("User not found!");
  
      // Check if there's a referral for this application
      const referral = await this.referralModel.findOne({
          jobId: application.jobId,
          referredEmail: application.userEmail,
      });
  
      if (referral) {
          // Update referral status to "approved" when the applicant is shortlisted
          referral.status = 'approved';
          await referral.save();
      }
      rejectedMail(user.email, user.name, job.title, job.companyName);

      return { message: "Application shortlisted successfully!" };
    }
  

    async rejectApplication(applicationId: string, body: any) {
        const { userId, jobId } = body;

        const job = await this.jobModel.findById(jobId);
        if (!job) throw new NotFoundException("Job not found!");

        const application = await this.appliedJobModel.findById(applicationId);
        if (!application) throw new NotFoundException("Application not found for this user!");

        const user = await this.userModel.findById(userId);
        if (!user) throw new NotFoundException("User not found!");

        application.status = 'rejected';
        await application.save();

        // Send email to the applicant
        rejectedMail(user.email, user.name, job.title, job.companyName);

        return { message: "Application shortlisted successfully!" };
    }
    
}
