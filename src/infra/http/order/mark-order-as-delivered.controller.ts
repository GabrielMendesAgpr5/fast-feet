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
import { MarkOrderAsDeliveredUseCase } from '@/domain/fastfeet/application/use-cases/order/mark-order-as-delivered-usecase'
import {
  MarkOrderAsDeliveredDTO,
  validateMarkOrderAsDeliveredDTO,
} from './dto/MarkOrderAsDeliveredDTO'

@ApiBearerAuth('bearer')
@ApiTags('order')
@Controller('/order/')
export class MarkOrderAsDeliveredController {
  constructor(
    private readonly markOrderAsDeliveredUseCase: MarkOrderAsDeliveredUseCase,
  ) {}

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Mark order as delivered' })
  @HttpCode(HttpStatus.PARTIAL_CONTENT)
  async handle(
    @Body(validateMarkOrderAsDeliveredDTO) dto: MarkOrderAsDeliveredDTO,
  ) {
    const { orderId } = dto

    const result = await this.markOrderAsDeliveredUseCase.execute({
      orderId,
    })

    if (result.isLeft()) {
      const error: Error = result.value as Error
      if (error instanceof NotAllowedError)
        throw new ForbiddenException(error.message)
      throw new BadRequestException(error.message)
    }
  }
}
