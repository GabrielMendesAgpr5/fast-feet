import {
  Controller,
  Body,
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
import { AssignDeliverymanToOrderUseCase } from '@/domain/fastfeet/application/use-cases/orders/assign-deliveryman-to-order-usecase'
import {
  AssignDeliverymanToOrderDTO,
  validateAssignDeliverymanToOrderDTO,
} from './dto/AssignDeliverymanToOrderDTO'
import { UserRoleEnum } from '@/domain/fastfeet/enterprise/entities/user'
import { Roles } from '@/infra/auth/roles.decorator'

@ApiBearerAuth('bearer')
@ApiTags('order')
@Controller('/order/')
export class AssignDeliverymanToOrderController {
  constructor(
    private readonly assignDeliverymanToOrderUseCase: AssignDeliverymanToOrderUseCase,
  ) {}

  @Patch(':orderId/assign')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Assign deliveryman to order (Admin Only)' })
  @Roles(UserRoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  async handle(
    @Param('orderId') orderId: string,
    @Body(validateAssignDeliverymanToOrderDTO) dto: AssignDeliverymanToOrderDTO,
  ) {
    const { deliverymanId } = dto

    const result = await this.assignDeliverymanToOrderUseCase.execute({
      orderId,
      deliverymanId,
    })

    if (result.isLeft()) {
      const error: Error = result.value as Error
      if (error instanceof NotAllowedError)
        throw new ForbiddenException(error.message)
      throw new BadRequestException(error.message)
    }

    return { message: 'Deliveryman assigned successfully' }
  }
}
