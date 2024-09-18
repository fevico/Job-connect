import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/user/schema/user.schema';
import { Contact, ContactSchema } from './schema/contact';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: Contact.name, schema: ContactSchema },
    ])
  ],
  controllers: [ContactController],
  providers: [ContactService]
})
export class ContactModule {}
