import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { PlansService } from './plans.service';

@Controller('plans')
export class PlansController {
    constructor(private planService: PlansService){}

    @Post('create')
    // @UseGuards(AuthGuard('jwt'))
    createPlan(@Body() body: any) {
        return this.planService.createPlan(body);
    }

    @Patch('update')
    // @UseGuards(AuthGuard('jwt'))
    updatePlan(@Body() body: any) {
        return this.planService.updatePlan(body);
    }

    @Get('get-plans')
    // @UseGuards(AuthGuard('jwt'))
    getPlans() {
        return this.planService.getPlans();
    }

    @Get('get-plans-by-id')
    getPlansById(@Body() body: any) {
        return this.planService.getPlansById(body);
    }

    @Delete('delete-plan')
    // @UseGuards(AuthGuard('jwt'))
    deletePlan(@Body() body: any) {
        return this.planService.deletePlan(body);
    }
}
