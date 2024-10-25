import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { Roles } from 'src/decorator/role.decorator';
import { AuthenticationGuard } from 'src/guards/auth.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { Request } from 'express';
import { ProductDto, UpdateProductDto, UploadCvDetails } from './dto/product.dto';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) {}

    @Roles(['cvWriter', 'linkedinOptimizer'])
    @Post('create')
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    async createProduct(@Body() body: ProductDto, @Req() req: Request) {
        const userId = req.user.id;
        const role = req.user.role;
         return this.productService.createProduct(body, userId, role );
    }

    @Roles(['cvWriter', 'linkedinOptimizer'])
    @Patch('update/:id')
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    async updateProduct(@Body() body: UpdateProductDto, @Req() req: Request, @Param('id') id: string) {
        const userId = req.user.id;
        const role = req.user.role;
        return this.productService.updateProduct(body, userId, role, id);
    }

    @Get('all')
    async getAllProduct() {
        return this.productService.getAllProduct();
    }

    @Get(':id')
    async getProductById(@Param('id') id: string) {
        return this.productService.getProductById(id);
    }

    @Roles(['cvWriter', 'linkedinOptimizer'])
    @Delete(':id')
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    async deleteProduct(@Req() req: Request, @Param('id') id: string) {
        const userId = req.user.id;
        const role = req.user.role;
        return this.productService.deleteProduct(userId, role, id);
    }

    @Roles(['cvWriter', 'linkedinOptimizer ']) 
    @Get('user/product')
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    async geUserProduct(@Req() req: Request) {
        const userId = req.user.id;
        const role = req.user.role;
        return this.productService.geUserProduct(userId, role,);
    }

    @Roles(['cvWriter'])
    @Post('upload-cv')
    @UseGuards(AuthenticationGuard, AuthorizationGuard)
    async uploadCV(@Body() body: UploadCvDetails, @Req() req: Request) {
         return this.productService.uploadCV(body);
    }

}
