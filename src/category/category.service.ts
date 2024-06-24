import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schema/category.schema';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
    constructor(@InjectModel(Category.name) private categoryModel: Model<Category>,){}

    async createCategory(data: CreateCategoryDto){
        const {name} = data
        const categoryExist = await this.categoryModel.findOne({name})
        if(categoryExist)
            throw new Error('Category already exists')
        //create category
        const category = await this.categoryModel.create({name})
        return category
    }

    async getAllCategories(){
        try { 
        const categories = await this.categoryModel.find() 
        if (!categories || categories.length === 0) {
            throw new NotFoundException('No categories found');
          }       
           return categories

        } catch (error) {
            throw new UnprocessableEntityException(`Failed to fetch category: ${error.message}`);  
        }
    }
    
    async getCategoryById(id: string): Promise<Category> {
        try {
          const category = await this.categoryModel.findById(id).exec();
          if (!category) {
            throw new NotFoundException('Category not found');
          }
          return category;
        } catch (error) {
          // Handle specific Mongoose errors or other potential errors
          throw new UnprocessableEntityException(`Failed to fetch category: ${error.message}`);
        }
      }
}
