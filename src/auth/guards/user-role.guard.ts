import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ValidRoles } from '../enums/valid-roles';
import { Reflector } from '@nestjs/core';
import { META_ROLES } from '../decorators';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get<ValidRoles[]>(META_ROLES, context.getHandler())
    console.log(validRoles)
    if( !validRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;
    console.log(user)
    if( !user ) throw new BadRequestException('user not found');
    
    for (const role of user.roles) {
      if(validRoles.includes(role)) {
       return true
      } 
     }
    throw new ForbiddenException(`User ${user.fullname} need a valid role [${validRoles}]`)
  }
}
