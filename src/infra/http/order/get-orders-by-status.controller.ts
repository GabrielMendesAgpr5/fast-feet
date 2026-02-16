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
import { GetOrdersByDeliverymanQueryDTO } from './dto/GetOrderByDeliverymanQueryDTO'
import { UserRoleEnum } from '@/domain/fastfeet/enterprise/entities/user'
import { GetOrdersByStatusUseCase } from '@/domain/fastfeet/application/use-cases/orders/get-orders-by-status-usecase'

@ApiBearerAuth('bearer')
@ApiTags('order')
@Controller('/orders')
export class GetOrdersByStatusController {
  constructor(
    private readonly getOrdersByStatusUseCase: GetOrdersByStatusUseCase,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiOperation({ summary: 'Get orders by status (Admin Only)' })
  @HttpCode(HttpStatus.OK)
  async handle(
    @Query(new ValidationPipe({ transform: true }))
    query: GetOrdersByDeliverymanQueryDTO,
  ) {
    const result = await this.getOrdersByStatusUseCase.execute({
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
