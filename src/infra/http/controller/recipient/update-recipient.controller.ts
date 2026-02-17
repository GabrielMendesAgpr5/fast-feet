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
import {
  UpdateRecipientDTO,
  validateUpdateRecipientDTO,
} from './dto/UpdateRecipientDTO'
import { UpdateRecipientUseCase } from '@/domain/fastfeet/application/use-cases/recipients/update-recipient-usecase'
import { RecipientPresenter } from '../../presenter/recipient/recipient-presenter'

@ApiBearerAuth('bearer')
@ApiTags('recipient')
@Controller('/recipient')
export class UpdateRecipientController {
  constructor(
    private readonly updateRecipientUseCase: UpdateRecipientUseCase,
  ) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiOperation({ summary: 'Update a recipient (Admin Only)' })
  @ApiParam({ name: 'id', type: String })
  @HttpCode(HttpStatus.OK)
  async handle(
    @Param('id') id: string,
    @Body(validateUpdateRecipientDTO) dto: UpdateRecipientDTO,
  ) {
    const result = await this.updateRecipientUseCase.execute({ id, ...dto })

    if (result.isLeft()) {
      const error: Error = result.value as Error
      if (error instanceof NotFoundError)
        throw new NotFoundException(error.message)
      if (error instanceof NotAllowedError)
        throw new ForbiddenException(error.message)
      throw new BadRequestException(error.message)
    }

    const recipiet = result.value.recipient

    return RecipientPresenter.toHTTP(recipiet)
  }
}
