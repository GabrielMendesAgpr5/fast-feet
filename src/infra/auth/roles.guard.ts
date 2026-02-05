import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import type { Request } from 'express'
import { UserRoleEnum } from '@/domain/fastfeet/enterprise/entities/user'
import { ROLES_KEY } from './roles-decorator'

type RequestUser = {
  sub: string
  role: UserRoleEnum
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    )

    if (!requiredRoles?.length) return true

    const request = context.switchToHttp().getRequest<Request>()
    const user = request.user as RequestUser | undefined

    if (!user?.role) throw new ForbiddenException('User role not found')

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('User does not have the required role')
    }

    return true
  }
}
