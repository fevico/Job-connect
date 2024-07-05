import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CvProfile } from './schema/cvProfile.schema';
import { Model } from 'mongoose';
import { CvProfileDto } from './dtc/cvProfile.dto';
import { User } from 'src/user/schema/user.schema';
import { Profile } from 'src/user/schema/profile.schema';

@Injectable()
export class CvService {
    constructor(
        @InjectModel(CvProfile.name) private cvProfileModel: Model<CvProfile>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Profile.name) private profileModel: Model<Profile>,
    ){}

    async createCvProfile(cvProfileDto: CvProfileDto, userId: string){
        const user = await this.userModel.findById(userId);
        if(!user) throw new UnauthorizedException("Unauthorized request, user not found!")
        const profile = await this.profileModel.findOne({userId: userId});
        if(!profile) throw new UnauthorizedException("Unauthorized request, you need to update your profile!")
            const createCvProfile = new this.cvProfileModel({
                ...cvProfileDto,
                userId,
                profileId: profile._id,
            });
            await createCvProfile.save();
            return createCvProfile;
    }

    async getCvProfile(userId: string){
        const profile = await this.profileModel.findOne({userId: userId});
        if(!profile) throw new UnauthorizedException("Unauthorized request, you need to update your profile!")
        const cvProfile = await this.cvProfileModel.findOne({userId: userId, profileId: profile._id});
        if(!cvProfile) throw new UnauthorizedException("Unauthorized request, you need to create your cv!")
        return cvProfile;
    }

    async getAllCvProfile(){
        const cvProfile = await this.cvProfileModel.find()
        // .populate('userId', '-password').populate('profileId', '-userId');
        return cvProfile;
    }

    async getCvProfileById(id: string){
        const cvProfile = await this.cvProfileModel.findById(id).populate('userId', '-password').populate("profileId", '-userId');
        if(!cvProfile) throw new UnauthorizedException("Unauthorized request, cv profile not found!")
        return cvProfile;
    }
}
