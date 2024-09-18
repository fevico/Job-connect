import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Contact } from './schema/contact';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { ContactDto } from './dto/contact.dto';
import { contactUs } from 'src/utils/mail';


@Injectable()
export class ContactService {
    constructor(
        @InjectModel(Contact.name) private readonly contactModel: Model<Contact>,
        @InjectModel(User.name) private readonly userModel: Model<User>,
    ){}

    async sendMessage(contactDto: ContactDto): Promise<Contact> {
        const { email } = contactDto;
    
        // Get the start and end of the current day
        const startOfDay = moment().startOf('day').toDate();
        const endOfDay = moment().endOf('day').toDate();
    
        // Check if the user has already submitted a message today
        const existingContact = await this.contactModel.findOne({
          email,
          createdAt: { $gte: startOfDay, $lt: endOfDay },
        });
    
        if (existingContact) {
          throw new BadRequestException('You have already submitted a message today. Please try again tomorrow.');
        }
        // Create a new contact message
        const createdContact = new this.contactModel(contactDto);
        await createdContact.save();

        const users = await this.userModel.find({ role: { $in: ['admin', 'jobPoster'] } });

        if (!users || users.length === 0) {
          throw new BadRequestException('No admin or jobPoster found');
        }
        
        // Loop through all found users and send an email to each
        for (const user of users) { 
          await contactUs(user.email, `${contactDto.firstName} ${contactDto.lastName}`, contactDto.phone, contactDto.message, contactDto.email);
        }
        
        return createdContact;
      }
    
}
