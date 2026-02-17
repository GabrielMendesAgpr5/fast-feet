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
import { GetNearbyOrdersUseCase } from '@/domain/fastfeet/application/use-cases/orders/get-nearby-orders-usecase'
import { GetNearbyOrdersQueryDTO } from './dto/GetNearbyOrdersQueryDTO'
import { UserRoleEnum } from '@/domain/fastfeet/enterprise/entities/user'

@ApiBearerAuth('bearer')
@ApiTags('order')
@Controller('/order')
export class GetNearbyOrdersController {
  constructor(
    private readonly getNearbyOrdersUseCase: GetNearbyOrdersUseCase,
  ) {}

  @Get('/nearby')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.DELIVERYMAN)
  @ApiOperation({
    summary: 'Get nearby pending orders (Deliverer Only)',
  })
  @HttpCode(HttpStatus.OK)
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(new ValidationPipe({ transform: true }))
    query: GetNearbyOrdersQueryDTO,
  ) {
    const result = await this.getNearbyOrdersUseCase.execute({
      latitude: query.latitude,
      longitude: query.longitude,
      maxDistanceKm: query.maxDistance,
    })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    const nearbyOrders = result.value

    return nearbyOrders
  }
}
