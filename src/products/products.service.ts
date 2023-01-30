import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryBuilder, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { validate as isUUID} from 'uuid';
import { ProductImage } from './entities';
import { ErrorHandler } from 'src/common/handler/error.handler';
import { User } from 'src/auth/entities/user.entity';
@Injectable()
export class ProductsService {
  private readonly loggerContext = 'ProductsService';
  constructor( 
    @InjectRepository(Product) 
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage) 
    private readonly imageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
    private readonly errorHandler: ErrorHandler
  ) {

  }
  async create(createProductDto: CreateProductDto, user: User) {
    try {
      const {images = [], ...productDetails } = createProductDto;


      const product = this.productRepository.create({
        ...productDetails, 
        user,
        images:images.map( img => this.imageRepository.create({url: img}))
      });
      await this.productRepository.save(product);
      return {...product, images };
    } catch (error) {
      this.errorHandler.handleDBExceptions(error, this.loggerContext);
    } 
  }

  async findAll(paginatioDto: PaginationDto) {
    const {limit = 10, offset = 0} = paginatioDto;
    try {
       const products = await this.productRepository.find({
        take: limit,
        skip: offset,
        relations: {
          images: true
        }
      });
      return products.map(product => ({
        ...product,
        images: product.images.map( img => img.url)
      }))
    } catch (error) {
      this.errorHandler.handleDBExceptions(error, this.loggerContext);
    }
  }

  async findOne(param: string) {
    let product: Product;
    if(isUUID(param)) {
      product = await this.productRepository.findOneBy({id: param});
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
      .where(`lower(title) = :title or slug = :slug`, {
        title: param.toLowerCase(),
        slug: param
      } )
      .leftJoinAndSelect('prod.images', 'prodImages')
      .getOne();
    }
     
    if( !product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }
  async findOnePlain(term: string) {
    const {images = [], ...rest} = await this.findOne(term);
    return {
      ...rest,
      images: images.map( img => img.url)
    }
  }
  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    const {images, ...toUpdate} = updateProductDto;
    const product = await this.productRepository.preload({
      id,
      ...toUpdate,
      user,
      images: []
    });
    if( !product ) throw new BadRequestException(`Product ${id} not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if( images ) {
        await queryRunner.manager.delete(ProductImage, { product: { id }});
        product.images = images.map( img => this.imageRepository.create({url: img}))
      }
      await queryRunner.manager.save(product );
      await queryRunner.commitTransaction();
      await queryRunner.release();
      // await this.productRepository.update({id: id}, product);
      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.errorHandler.handleDBExceptions(error, this.loggerContext)
    }
    
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.productRepository.delete(id);

  }
  async removeAll() {
    const query = this.productRepository.createQueryBuilder('product');

    try {
      return await query
      .delete()
      .where({})
      .execute();
    } catch (error) {
      this.errorHandler.handleDBExceptions(error, this.loggerContext);
    }
  }

}
