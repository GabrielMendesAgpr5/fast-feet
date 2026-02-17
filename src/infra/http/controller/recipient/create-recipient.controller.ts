import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { UserRoleEnum } from '@/domain/fastfeet/enterprise/entities/user'
import { Roles } from '@/infra/auth/roles.decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { CreateRecipientUseCase } from '@/domain/fastfeet/application/use-cases/recipients/create-recipient-usecase'
import { GeocodingFailedError } from '@/core/errors/use-case-errors/geocoding-error'
import {
  CreateRecipientDTO,
  validateCreateRecipientDTO,
} from './dto/CreateRecipientDTO'
import { RecipientPresenter } from '../../presenter/recipient/recipient-presenter'

@ApiBearerAuth('bearer')
@ApiTags('recipient')
@Controller('/recipient')
export class CreateRecipientController {
  constructor(
    private readonly createRecipientUseCase: CreateRecipientUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiOperation({ summary: 'Create recipient (Admin only)' })
  @HttpCode(HttpStatus.CREATED)
  async handle(@Body(validateCreateRecipientDTO) body: CreateRecipientDTO) {
    const result = await this.createRecipientUseCase.execute(body)

    if (result.isLeft()) {
      const error = result.value

      if (error instanceof GeocodingFailedError) {
        throw new BadRequestException(error.message)
      }

      throw new BadRequestException((error as Error).message)
    }

    const recipient = result.value.recipient

    return RecipientPresenter.toHTTP(recipient)
  }
}
