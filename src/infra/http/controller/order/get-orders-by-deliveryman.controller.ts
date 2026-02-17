import {
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  UseGuards,
  Get,
  Query,
  ValidationPipe,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { Roles } from '@/infra/auth/roles.decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import { GetOrdersByDeliverymanUseCase } from '@/domain/fastfeet/application/use-cases/orders/get-orders-by-deliveryman-usecase'
import { GetOrdersByDeliverymanQueryDTO } from './dto/GetOrderByDeliverymanQueryDTO'
import { UserRoleEnum } from '@/domain/fastfeet/enterprise/entities/user'

@ApiBearerAuth('bearer')
@ApiTags('order')
@Controller('/order')
export class GetOrdersByDeliverymanController {
  constructor(
    private readonly getOrdersByDeliverymanUseCase: GetOrdersByDeliverymanUseCase,
  ) {}

  @Get('/my-orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.DELIVERYMAN)
  @ApiOperation({ summary: 'Get orders by deliveryman' })
  @HttpCode(HttpStatus.OK)
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(new ValidationPipe({ transform: true }))
    query: GetOrdersByDeliverymanQueryDTO,
  ) {
    const result = await this.getOrdersByDeliverymanUseCase.execute({
      deliverymanId: user.sub,
      status: query.status,
    })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    const { orders } = result.value

    return {
      orders: orders.map((order) => ({
        id: order.id.toString(),
        product: order.product,
        recipientId: order.recipientId.toString(),
        status: order.status,
        createdAt: order.createdAt,
        availableAt: order.availableAt,
        withdrawnAt: order.withdrawnAt,
        deliveredAt: order.deliveredAt,
        returnedAt: order.returnedAt,
      })),
    }
  }
}
