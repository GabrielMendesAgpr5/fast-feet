import {
  Controller,
  HttpCode,
  HttpStatus,
  ForbiddenException,
  BadRequestException,
  UseGuards,
  Patch,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger'
import { NotAllowedError } from '@/core/errors/use-case-errors/not-allowed-error'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { MarkOrderAsDeliveredUseCase } from '@/domain/fastfeet/application/use-cases/orders/mark-order-as-delivered-usecase'
import { CurrentUser } from '@/infra/auth/current-user.decorator'
import type { UserPayload } from '@/infra/auth/jwt.strategy'
import { Roles } from '@/infra/auth/roles.decorator'
import { UserRoleEnum } from '@/domain/fastfeet/enterprise/entities/user'
import { multerConfig } from '@/infra/http/multer/multer.config'

@ApiBearerAuth('bearer')
@ApiTags('order')
@Controller('/order/')
export class MarkOrderAsDeliveredController {
  constructor(
    private readonly markOrderAsDeliveredUseCase: MarkOrderAsDeliveredUseCase,
  ) {}

  @Patch(':orderId/delivery')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.DELIVERYMAN)
  @UseInterceptors(FileInterceptor('photo', multerConfig))
  @ApiOperation({ summary: 'Mark order as delivered (Deliverer Only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        photo: {
          type: 'string',
          format: 'binary',
          description: 'Delivery proof photo (JPEG or PNG, max 5MB)',
        },
      },
      required: ['photo'],
    },
  })
  @HttpCode(HttpStatus.OK)
  async handle(
    @Param('orderId') orderId: string,
    @CurrentUser() user: UserPayload,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    if (!photo) {
      throw new BadRequestException('Photo is required to complete delivery')
    }

    const result = await this.markOrderAsDeliveredUseCase.execute({
      orderId,
      deliverymanId: user.sub,
      photoFilename: photo.filename,
      photoPath: photo.path,
    })

    if (result.isLeft()) {
      const error: Error = result.value as Error
      if (error instanceof NotAllowedError)
        throw new ForbiddenException(error.message)
      throw new BadRequestException(error.message)
    }

    return {
      message: 'Order marked as delivered successfully',
    }
  }
}
