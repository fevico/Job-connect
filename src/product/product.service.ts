import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schema/product.schema';
import { Model } from 'mongoose';
import { ProductDto, UpdateProductDto, UploadCvDetails } from './dto/product.dto';
import { User } from 'src/user/schema/user.schema';
import { sendCvDetails } from 'src/utils/mail';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<Product>, 
        @InjectModel(User.name) private userModel: Model<User>, 
    ){}

    async createProduct(body: ProductDto, userId: string, role: string){
        const {title, description, price, images} = body;
        const user = await this.userModel.findById(userId)
        if(!user) throw new NotFoundException('User not found!');
        const product = new this.productModel({
            title,
            description,
            price,
            images,
            userId,
        })
        product.type = role;
        return await product.save();
    }

    async updateProduct(body: UpdateProductDto, userId: string, role: string, id: string){
        const {title, description, timeFrame, price, images} = body;
        const findUser = await this.productModel.findOne({userId, _id: id, type: role});
        if(!findUser) throw new UnauthorizedException('You cannot update this product!');
        const product = await this.productModel.findByIdAndUpdate(id, {...body});
        if(!product) throw new UnauthorizedException('You cannot update this product!');
        return product;        
    }

    async getAllProduct(){
        const products = await this.productModel.find()
        if(!products) throw new UnauthorizedException('No product found!');
        return products;
    }

    async getProductById(id){
        const product = await this.productModel.findById(id);
        if(!product) throw new UnauthorizedException('No product found!');
        return product;
    }

    async deleteProduct(id, userId, role){
        const findUser = await this.productModel.findOne({userId, _id: id, type: role});
        if(!findUser) throw new UnauthorizedException('You cannot delete this product!');
        const product = await this.productModel.findByIdAndDelete(id);
        if(!product) throw new UnauthorizedException('You cannot delete this product!');
        return true
    }

    async geUserProduct(userId: string, role: string){
        const products = await this.productModel.find({userId, type: role});
        if(!products) throw new UnauthorizedException('No product found!');
        return products;
    }

    async uploadCV(body: UploadCvDetails){
        const {email, cv} = body 
        const user = await this.userModel.findOne({email});
        if(!user) throw new NotFoundException('User not found!');
        sendCvDetails(email, user.name, cv);
        return {message: "CV details uploaded successfully!"}
    }
}
