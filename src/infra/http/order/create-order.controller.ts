import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ConflictException,
  ForbiddenException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateOrderUseCase } from '@/domain/fastfeet/application/use-cases/orders/create-order-usecase'
import { ConflictError } from '@/core/errors/use-case-errors/conflict-error'
import { NotAllowedError } from '@/core/errors/use-case-errors/not-allowed-error'
import { UserRoleEnum } from '@/domain/fastfeet/enterprise/entities/user'
import { Roles } from '@/infra/auth/roles.decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { CreateOrderDTO, validateCreateOrderDTO } from './dto/CreateOrderDTO'

@ApiBearerAuth('bearer')
@ApiTags('order')
@Controller('/order')
export class CreateOrderController {
  constructor(private readonly createOrderUseCase: CreateOrderUseCase) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiOperation({ summary: 'Create a new order' })
  @HttpCode(HttpStatus.CREATED)
  async handle(@Body(validateCreateOrderDTO) dto: CreateOrderDTO) {
    const { id, product, recipientId } = dto

    const result = await this.createOrderUseCase.execute({
      id,
      product,
      recipientId,
    })

    if (result.isLeft()) {
      const error: Error = result.value as Error
      if (error instanceof ConflictError)
        throw new ConflictException(error.message)
      if (error instanceof NotAllowedError)
        throw new ForbiddenException(error.message)
      throw new BadRequestException(error.message)
    }

    const { order } = result.value
    return {
      id: order.id,
      product: order.product,
      recipientId: order.recipientId,
    }
  }
}
