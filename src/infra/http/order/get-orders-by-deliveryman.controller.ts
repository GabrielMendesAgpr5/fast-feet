import {
  Controller,
  Body,
  HttpCode,
  HttpStatus,
  ForbiddenException,
  BadRequestException,
  UseGuards,
  Patch,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { NotAllowedError } from '@/core/errors/use-case-errors/not-allowed-error'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import {
  GetOrdersByDeliverymanDTO,
  validateGetOrdersByDeliverymanDTO,
} from './dto/GetOrdersByDeliverymanDTO copy'
import { GetOrdersByDeliverymanUseCase } from '@/domain/fastfeet/application/use-cases/order/get-orders-by-deliveryman-usecase'

@ApiBearerAuth('bearer')
@ApiTags('order')
@Controller('/order')
export class GetOrdersByDeliverymanController {
  constructor(
    private readonly GetOrdersByDeliverymanUseCase: GetOrdersByDeliverymanUseCase,
  ) {}

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get orders by deliveryman' })
  @HttpCode(HttpStatus.OK)
  async handle(
    @Body(validateGetOrdersByDeliverymanDTO) dto: GetOrdersByDeliverymanDTO,
  ) {
    const { deliverymanId } = dto

    const result = await this.GetOrdersByDeliverymanUseCase.execute({
      deliverymanId,
    })

    if (result.isLeft()) {
      const error: Error = result.value as Error
      if (error instanceof NotAllowedError)
        throw new ForbiddenException(error.message)
      throw new BadRequestException(error.message)
    }

    const { order } = result.value
    return {
      id: order.id,
      product: order.product,
      recipientId: order.recipientId,
      satatus: order.status,
      createdAt: order.createdAt,
      availableAt: order.availableAt,
      withdrawnAt: order.withdrawnAt,
      deliveredAt: order.deliveredAt,
      returnedAt: order.returnedAt,
    }
  }
}
