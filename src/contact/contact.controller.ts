import { Body, Controller, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactDto } from './dto/contact.dto';

@Controller('contact')
export class ContactController {
    constructor( private contactService: ContactService) {}

    @Post('send-message')
    sendMessage(@Body() createContactDto: ContactDto) {
        return this.contactService.sendMessage(createContactDto) 
    }
}
