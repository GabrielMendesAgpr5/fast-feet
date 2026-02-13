import {
  Controller,
  HttpCode,
  HttpStatus,
  ForbiddenException,
  BadRequestException,
  UseGuards,
  Patch,
  Param,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { NotAllowedError } from '@/core/errors/use-case-errors/not-allowed-error'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { MarkOrderAsReturnedUseCase } from '@/domain/fastfeet/application/use-cases/orders/mark-order-as-returned-usecase'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { Roles } from '@/infra/auth/roles.decorator'
import { UserRoleEnum } from '@/domain/fastfeet/enterprise/entities/user'

@ApiBearerAuth('bearer')
@ApiTags('order')
@Controller('/order/')
export class MarkOrderAsReturnedController {
  constructor(
    private readonly markOrderAsReturnedUseCase: MarkOrderAsReturnedUseCase,
  ) {}

  @Patch(':orderId/return')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiOperation({ summary: 'Mark order as returned (Admin Only)' })
  @HttpCode(HttpStatus.OK)
  async handle(
    @Param('orderId') orderId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const result = await this.markOrderAsReturnedUseCase.execute({
      orderId,
      deliverymanId: user.sub,
    })

    if (result.isLeft()) {
      const error: Error = result.value as Error
      if (error instanceof NotAllowedError)
        throw new ForbiddenException(error.message)
      throw new BadRequestException(error.message)
    }
  }
}
