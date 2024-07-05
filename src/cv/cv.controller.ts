import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CvService } from './cv.service';
import { AuthenitcationGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorator/role.decorator';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import {Request} from 'express'
import { CvProfileDto } from './dtc/cvProfile.dto';

@Controller('cv')
export class CvController {
    constructor(private cvService: CvService){}

    @Roles(['cvwriter'])
    @Post('create-cv-profile')
    @UseGuards(AuthenitcationGuard, AuthorizationGuard)
    createCvProfile(@Body() cvProfileDto: CvProfileDto, @Req() req: Request){
        const userId = req.user.id;
        return this.cvService.createCvProfile(cvProfileDto, userId);
    }

    @Roles(['cvwriter'])
    @Get('get-cv-profile')
    @UseGuards(AuthenitcationGuard, AuthorizationGuard)
    getCvProfile(@Req() req: Request){
        const userId = req.user.id;
        return this.cvService.getCvProfile(userId);
    }

    @Get('get-all-cv-profile')
    getAllCvProfile(){
        return this.cvService.getAllCvProfile();
    }

    @Get('get-cv-profile-by-id/:id')
    getCvProfileById(@Param('id') id: string){
        return this.cvService.getCvProfileById(id);
    }
    
}
