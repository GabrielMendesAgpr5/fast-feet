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
  NotFoundException,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { NotAllowedError } from '@/core/errors/use-case-errors/not-allowed-error'
import { UserRoleEnum } from '@/domain/fastfeet/enterprise/entities/user'
import { Roles } from '@/infra/auth/roles.decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { NotFoundError } from '@/core/errors/use-case-errors/not-found-error'
import { UpdateOrderUseCase } from '@/domain/fastfeet/application/use-cases/orders/update-order-usecase'
import { UpdateOrderDTO, validateUpdateOrderDTO } from './dto/UpdateOrderDTO'
import { OrderPresenter } from '../../presenter/order/order-presenter'

@ApiBearerAuth('bearer')
@ApiTags('order')
@Controller('/order')
export class UpdateOrderController {
  constructor(private readonly updateOrderUseCase: UpdateOrderUseCase) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiOperation({ summary: 'Update order (Admin Only)' })
  @ApiParam({ name: 'id', type: String })
  @HttpCode(HttpStatus.OK)
  async handle(
    @Param('id') id: string,
    @Body(validateUpdateOrderDTO) dto: UpdateOrderDTO,
  ) {
    const result = await this.updateOrderUseCase.execute({ id, ...dto })

    if (result.isLeft()) {
      const error: Error = result.value as Error
      if (error instanceof NotFoundError)
        throw new NotFoundException(error.message)
      if (error instanceof NotAllowedError)
        throw new ForbiddenException(error.message)
      throw new BadRequestException(error.message)
    }

    const order = result.value.order

    return OrderPresenter.toHTTP(order)
  }
}
