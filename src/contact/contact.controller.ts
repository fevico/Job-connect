import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactDto, updateMessageDto } from './dto/contact.dto';
import { Roles } from 'src/decorator/role.decorator';
import { AuthenticationGuard } from 'src/guards/auth.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { Request } from 'express';

@Controller('contact')
export class ContactController {
    constructor( private contactService: ContactService) {}

    @Post('send-message')
    sendMessage(@Body() createContactDto: ContactDto) {
        return this.contactService.sendMessage(createContactDto) 
    }


    @Roles(['admin', 'jobPoster'])
    @Get('messages')
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    getMessages(@Req() req: Request) {
        return this.contactService.getMessages()
    }

    @Roles(['admin', 'jobPoster'])
    @Get(':contactId')
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    getSingleMessage(@Param('contactId') contactId: string) {
        return this.contactService.getSingleMessage(contactId)
    }

    @Roles(['admin', 'jobPoster'])
    @Patch(':contactId')
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    updateMessage(@Param('contactId') contactId: string, @Body() updateMessage: updateMessageDto) {
        return this.contactService.updateMessage(contactId, updateMessage)
    }
}
