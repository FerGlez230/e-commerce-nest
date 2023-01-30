import { UseGuards, applyDecorators } from '@nestjs/common';
import { ValidRoles } from '../enums/valid-roles';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';
import { Roles } from './roles.decorator';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    Roles(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}