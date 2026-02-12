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
import { MarkOrderAsPendingUseCase } from '@/domain/fastfeet/application/use-cases/orders/mark-order-as-pending-usecase'
import { Roles } from '@/infra/auth/roles.decorator'
import { UserRoleEnum } from '@/domain/fastfeet/enterprise/entities/user'

@ApiBearerAuth('bearer')
@ApiTags('order')
@Controller('/order/')
export class MarkOrderAsPendingController {
  constructor(
    private readonly markOrderAsPendingUseCase: MarkOrderAsPendingUseCase,
  ) {}

  @Patch(':orderId/enable')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiOperation({ summary: 'Mark order as Pending' })
  @HttpCode(HttpStatus.OK)
  async handle(@Param('orderId') orderId: string) {
    const result = await this.markOrderAsPendingUseCase.execute({
      orderId,
    })

    if (result.isLeft()) {
      const error: Error = result.value as Error
      if (error instanceof NotAllowedError)
        throw new ForbiddenException(error.message)
      throw new BadRequestException(error.message)
    }

    return {
      message: 'Order marked as Pending successfully',
    }
  }
}
