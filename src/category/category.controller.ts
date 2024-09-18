import { Body, Controller, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './schema/category.schema';
import { CreateCategoryDto } from './dto/category.dto';
import { Roles } from 'src/decorator/role.decorator';
import { AuthenticationGuard } from 'src/guards/auth.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';

@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService){}

    @Roles(['admin'])
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    @Post('create')
    createCategory(@Body() data: CreateCategoryDto){
         return this.categoryService.createCategory(data);
    }

    @Get('all')
    async getAllCategories(): Promise<Category[]> {
        try { 
          return await this.categoryService.getAllCategories(); 
        } catch (error) { 
          if (error instanceof NotFoundException) {
            throw new NotFoundException(error.message);
          }
          throw new Error(`Failed to fetch categories: ${error.message}`);
        }
      }

    @Get(':id')
    getCategoryById(@Param('id') id: string){
        return this.categoryService.getCategoryById(id);
    }

}
