// import { PartialType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger';
//Change in order to get the decorators from swagger, partialType doesn't have it
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
