import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schema/product.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private poductModel: Model<Product>, 
    ){}

    async createProduct(body: any, userId, role: string){
        const {title, description, portfolio, price, images, linkdinUrl} = body;
        const product = new this.poductModel({
            title,
            description,
            portfolio,
            price,
            images,
            linkdinUrl,
            userId,
        })
        product.type = role;
        return await product.save();
    }

    async updateProduct(body, userId, role, id){
        const {title, description, portfolio, price, images, linkdinUrl} = body;
        const findUser = await this.poductModel.findOne({userId, _id: id, type: role});
        if(!findUser) throw new UnauthorizedException('You cannot update this product!');
        const product = await this.poductModel.findByIdAndUpdate(id, {...body});
        if(!product) throw new UnauthorizedException('You cannot update this product!');
        return product;        
    }

    async getAllProduct(){
        const products = await this.poductModel.find()
        if(!products) throw new UnauthorizedException('No product found!');
        return products;
    }

    async getProductById(id){
        const product = await this.poductModel.findById(id);
        if(!product) throw new UnauthorizedException('No product found!');
        return product;
    }

    async deleteProduct(id, userId, role){
        const findUser = await this.poductModel.findOne({userId, _id: id, type: role});
        if(!findUser) throw new UnauthorizedException('You cannot delete this product!');
        const product = await this.poductModel.findByIdAndDelete(id);
        if(!product) throw new UnauthorizedException('You cannot delete this product!');
        return true
    }

    async geUserProduct(userId, role){
        const products = await this.poductModel.find({userId, type: role});
        if(!products) throw new UnauthorizedException('No product found!');
        return products;
    }
}
