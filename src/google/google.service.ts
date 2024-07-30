import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GoogleService {
    private readonly logger = new Logger(GoogleService.name);

    async googleLogin(req: any) {
        if (!req.user) {
            this.logger.error('No user from Google'); 
            return 'No user from google';
        }
        return {
            message: 'User Info from Google', 
            user: req.user
    }
}
}
