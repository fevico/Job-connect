import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JobService } from './job.service';
import { AuthenitcationGuard } from 'src/guards/auth.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { Roles } from 'src/decorator/role.decorator';
import { JobDto } from './dto/job.dto';
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

    // @Get('job/:id/applications')
    // getJobApplications(@Param('id') id: string){
    //     return this.jobService.getJobApplications(id);
    // }

    @Roles(['admin', 'employer'])
    @Get('get-jobs-by-employer/:id')
    @UseGuards(AuthenitcationGuard, AuthorizationGuard)
    getJobsByEmployer(@Param('id') id: string, @Req() req: Request){
        const userId = req.userId;

        return this.jobService.getJobsByEmployer(id, userId);
    }
}