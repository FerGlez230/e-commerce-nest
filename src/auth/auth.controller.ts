import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, CreateUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { RawHeaders, GetUser, Roles } from './decorators';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './enums/valid-roles';
import { Auth } from './decorators';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiResponse({status: 200, description: 'User added', type: User})
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }
  @Post('login')
  @ApiResponse({status: 200, description: 'User logged in'})
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
  @Get('status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }
  @Get('private')
  @Roles(ValidRoles.admin)
  @UseGuards( AuthGuard(), UserRoleGuard )
  testPrivateRoute(
    @GetUser() user: User, 
    @GetUser('email') userEmai: string,
    @RawHeaders() rawHeaders) {
    return { status: 'ok', user, userEmai, rawHeaders}
  }

  @Get('private2')
  @Auth(ValidRoles.superUser)
  testPrivateRoute2(
    @GetUser() user: User, 
    @GetUser('email') userEmai: string,
    @RawHeaders() rawHeaders) {
    return { status: 'ok', user, userEmai, rawHeaders}
  }
}
