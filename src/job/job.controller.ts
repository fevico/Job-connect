import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JobService } from './job.service';
import { AuthenitcationGuard } from 'src/guards/auth.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { Roles } from 'src/decorator/role.decorator';
import { JobDto, UpdateJobDto } from './dto/job.dto';
import { Request } from "express";


@Controller('job')
export class JobController {
    constructor(private jobService: JobService){}

    @Roles(['admin', 'employer'])
    @Post('create')
    @UseGuards(AuthenitcationGuard, AuthorizationGuard)
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

    @Roles(['admin', 'employer'])
    @Get('get-jobs-by-employer/:id')
    @UseGuards(AuthenitcationGuard, AuthorizationGuard)
    getJobsByEmployer(@Param('id') id: string, @Req() req: Request){
        const userId = req.userId;

        return this.jobService.getJobsByEmployer(id, userId);
    }

    @Post('apply-job')
    @UseGuards(AuthenitcationGuard)
    async applyJob(@Body() applyJobDto: any, @Req() req: Request){
        const userId = req.userId;

        return this.jobService.applyJob(applyJobDto, userId);
    }

    @Get('get-applied-jobs')
    @UseGuards(AuthenitcationGuard)
    getAppliedJobs( @Req() req: Request){
        const userId = req.userId;
        
        return this.jobService.getAppliedJobs(userId);
    }

    @Get('get-applications-by-job/:id')
    getApplicationsByJob(@Param('id') id: string){
        return this.jobService.getApplicationsByJob(id);
    }

    @Roles(['admin', 'employer'])
    @Get('get-employer-application')
    @UseGuards(AuthenitcationGuard, AuthorizationGuard)
    getEmployerApplication(@Req() req: Request){
        const userId = req.userId;

        return this.jobService.getEmployerApplication(userId);
    }

    @Roles(['admin', 'employer'])
    @Post('hire-applicant/:id')
    @UseGuards(AuthenitcationGuard, AuthorizationGuard)
    hireApplicant(@Body() body: any, @Param('id') jobId: any, @Req() req: Request){
        const userId = req.userId;

        return this.jobService.hireApplicant(body, userId, jobId);
    }

    @Roles(['admin', 'employer'])
    @Get('application-number/:id')
    @UseGuards(AuthenitcationGuard, AuthorizationGuard)
    getApplicationNumber(@Param('id') jobId: any, @Req() req: Request){
        const userId = req.userId;

        return this.jobService.getApplicationNumber(userId, jobId);
    }
}