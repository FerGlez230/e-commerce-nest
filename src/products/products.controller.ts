import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Product } from './entities';
@ApiTags('Products')
@Controller('products')
@Auth()
@ApiBearerAuth()
@ApiResponse({status: 403, description: 'Forbidden. Token related'})
@ApiResponse({status: 400, description: 'Bad request'})
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiResponse({status: 201, description: 'Product added', type: Product})
  create(@Body() createProductDto: CreateProductDto,   @GetUser() user: User) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  findAll(@Query() paginatioDto: PaginationDto) {
    return this.productsService.findAll(paginatioDto);
  }

  @Get(':param')
  @ApiResponse({status: 200, description: 'Product found', type: Product})
  findOne(@Param('param') param: string) {
    return this.productsService.findOnePlain(param);
  }

  @Patch(':uuid')
  @ApiResponse({status: 200, description: 'Product updated', type: Product})
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User) {
    return this.productsService.update(uuid, updateProductDto, user);
  }

  @Delete(':id')
  @ApiResponse({status: 200, description: 'Product deleted', type: String})
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
