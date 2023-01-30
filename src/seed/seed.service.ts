import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { ErrorHandler } from 'src/common/handler/error.handler';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class SeedService {
  private readonly loggerContext = 'SeedService';
  constructor(
    private readonly productService: ProductsService, 
    private readonly authService: AuthService,
    // @InjectRepository(User)
    // private readonly userRepository: Repository<User>,
    private errorHandler: ErrorHandler,

  ){}
  async execute() {
    await this.deleteAll();
    const {token,  ...adminUser} = await this.insertNewUsers();
    await this.insertNewProducts( adminUser);
    return `Seed executed by ${adminUser.fullname}`;
  }
  private async deleteAll() {
    await this.productService.removeAll();
    this.authService.removeAll();
  }
  private async insertNewUsers() {
    const {users} = initialData;
    const insertPromises = [];
    users.forEach( user => {
      insertPromises.push(this.authService.create(user));
    })

    const usersDB = await Promise.all(insertPromises);
    console.log(usersDB[0])
    return usersDB[0].userResp;
  }
  private async insertNewProducts(admin: User) {
    const {products} = initialData;
    await this.productService.removeAll();
    const insertPromises = [];
    products.forEach(product => {
       insertPromises.push(this.productService.create( product, admin ));
     })
    await Promise.all(insertPromises);

  }
}
