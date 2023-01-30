import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ErrorHandler } from 'src/common/handler/error.handler';
import { Repository } from 'typeorm';
import  *  as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { GetUser } from './decorators';

@Injectable()
export class AuthService {
  private loggerContext = 'Auth service';
  constructor(
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,
    private readonly errorHandler: ErrorHandler,
    private readonly jwtService: JwtService,
   ){

  }
  async create(createAuthDto: CreateUserDto) {
    try {
      const {password, ...rest} = createAuthDto;
      const user = {
        ...rest,
        password: bcrypt.hashSync( password, 10)
      }
      const userObj = this.userRepository.create(user);
      const userResp = await this.userRepository.save(userObj);
      delete userResp.password;
      return { userResp, token: this.getJwtToken({id: userResp.id}) };

    } catch (error) {
      this.errorHandler.handleDBExceptions(error, this.loggerContext);
    }
  }
  async login(loginUserDto: LoginUserDto) {
    const {password, email} = loginUserDto;

    const user = await this.userRepository.findOne({
      where: {email}, 
      select: {email: true, password: true, id: true}
    });
    if( !user) throw new UnauthorizedException('Email not found');
    if( !bcrypt.compareSync(password, user.password)) throw new UnauthorizedException('Credentials not valid');
    return {...user, token: this.getJwtToken({id: user.id})}
  }
  private getJwtToken( payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
  checkAuthStatus(user: User ) {
    return {...user, token: this.getJwtToken({id: user.id})}
  }
  async removeAll() {
    const query = this.userRepository.createQueryBuilder('product');

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
