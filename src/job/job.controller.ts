import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JobService } from './job.service';
import { AuthenticationGuard } from 'src/guards/auth.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { Roles } from 'src/decorator/role.decorator';
import { JobDto, UpdateJobDto } from './dto/job.dto';
import { Request } from "express";
import { PARAMTYPES_METADATA } from '@nestjs/common/constants';


@Controller('job')
export class JobController {
    constructor(private jobService: JobService){}

    @Roles(['admin', 'employer', 'jobPoster'])
    @Post('create')
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    async createJob(@Body() jobDto: JobDto, @Req() req: Request) {
        const userId = req.userId;

       // Use userId as needed for further business logic
        return this.jobService.createJob(jobDto, userId);
    }

    @Get('all-jobs') 
    getAllJobs(){
        return this.jobService.getAllJobs();
    }

    @Get('job/:id')
    getJobById(@Param('id') id: string){
        return this.jobService.getJobById(id);
    }

    @Roles(['admin', 'employer', 'jobPoster'])
    @Get('get-jobs-by-employer/:id')
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    getJobsByEmployer(@Param('id') id: string, @Req() req: Request){
        const userId = req.userId;

        return this.jobService.getJobsByEmployer(id, userId);
    }

    @Post('apply-job')
    @UseGuards(AuthenticationGuard)
    async applyJob(@Body() applyJobDto: any, @Req() req: Request){
        const userId = req.userId;

        return this.jobService.applyJob(applyJobDto, userId);
    }

    @Get('get-applied-jobs')
    @UseGuards(AuthenticationGuard)
    getAppliedJobs( @Req() req: Request){
        const userId = req.userId;
        
        return this.jobService.getAppliedJobs(userId);
    }

    @Get('get-applications-by-job/:id')
    getApplicationsByJob(@Param('id') id: string){
        return this.jobService.getApplicationsByJob(id);
    }

    @Roles(['admin', 'employer', 'jobPoster'])
    @Get('get-employer-application')
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    getEmployerApplication(@Req() req: Request){
        const userId = req.userId;

        return this.jobService.getEmployerApplication(userId);
    }

    @Roles(['admin', 'employer', 'jobPoster'])
    @Post('hire-applicant/:id')
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    hireApplicant(@Body() body: any, @Param('id') jobId: any, @Req() req: Request){
        const userId = req.userId;

        return this.jobService.hireApplicant(body, userId, jobId);
    }

    @Roles(['admin', 'employer', 'jobPoster'])
    @Get('application-number/:id')
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    getApplicationNumber(@Param('id') jobId: any, @Req() req: Request){
        const userId = req.userId;

        return this.jobService.getApplicationNumber(userId, jobId);
    }

    @Roles(['admin', 'employer', 'jobPoster'])
    @Post('shortlist-application/:id')
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    shortlistJob(@Param('id') id: string, @Body() body: any){
        return this.jobService.shortlistApplicant(id, body)
    }

    @Post('reject-application/:id')
    rejectApplication(@Param('id') id: string, @Body() body: any){
        return this.jobService.rejectApplication(id, body)
    }

    @Roles(['admin'])
    @Delete(":id")
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    deleteJob(@Param('id') id: string){
        return this.jobService.deleteJob(id)
    }
    @Roles(['admin', 'employer', 'jobPoster'])
    @Patch(':id')
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    updateJob (@Param("id") id: string, @Body() body: any, @Req() req: Request){
        const userId = req.user.id
        return this.jobService.updateJob(body, id, userId)
    }
}