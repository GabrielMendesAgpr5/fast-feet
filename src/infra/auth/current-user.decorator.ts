import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UserPayload } from './jwt.strategy'

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserPayload => {
    const request = context.switchToHttp().getRequest<{ user: UserPayload }>()
    return request.user
  },
)
