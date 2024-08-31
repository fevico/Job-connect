import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';

@Injectable()
export class GoogleService {
    private readonly logger = new Logger(GoogleService.name);

    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly jwtService: JwtService,
    ) {}

    async googleLogin(profile: any) {
        try {
            const { emails } = profile;
            if (!emails || emails.length === 0) {
                throw new Error('No email found in the Google profile');
            }

            const email = emails[0].value;
            
            // Check if the user exists in the database
            let user = await this.userModel.findOne({ email });
            if (!user) {
                throw new UnauthorizedException('You must sign up through normal login first.');
              }

            // Generate a JWT token for the user
            const payload = {
                email: user.email,
                id: user._id,
                role: user.role,
                // Add other fields as needed
            };

            const jwtToken = this.jwtService.sign(payload, {
                secret: process.env.JWT_SECRET,
                expiresIn: '1h',
            });

            // Return user data along with JWT token
            return {
                message: 'User Info from Google',
                user: {
                    ...user.toObject(), // Convert Mongoose document to plain object
                    accessToken: jwtToken,
                },
            };
        } catch (error) {
            this.logger.error('Error during Google login', error.stack);
            throw new Error('Error during Google login');
        }
    }
}
