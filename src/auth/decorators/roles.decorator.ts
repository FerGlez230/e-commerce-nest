import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../enums/valid-roles';
export const META_ROLES = 'roles';
export const Roles = (...args: ValidRoles[]) => SetMetadata(META_ROLES, args);
