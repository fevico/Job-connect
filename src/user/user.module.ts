import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { PasswordResetToken, PasswordResetTokenSchema } from './schema/passwordResetToken';
import { EmailVerificationToken, EmailVerificationTokenSchema } from './schema/emailVerificationToken';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h' }
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: PasswordResetToken.name, schema: PasswordResetTokenSchema },
      { name: EmailVerificationToken.name, schema: EmailVerificationTokenSchema },
    ])
  ],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
