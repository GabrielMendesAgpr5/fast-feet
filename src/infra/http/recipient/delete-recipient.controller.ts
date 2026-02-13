import {
  Controller,
  HttpCode,
  HttpStatus,
  ForbiddenException,
  BadRequestException,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { NotAllowedError } from '@/core/errors/use-case-errors/not-allowed-error'
import { UserRoleEnum } from '@/domain/fastfeet/enterprise/entities/user'
import { Roles } from '@/infra/auth/roles.decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { NotFoundError } from '@/core/errors/use-case-errors/not-found-error'
import { DeleteRecipientUseCase } from '@/domain/fastfeet/application/use-cases/recipients/delete-recipient-usecase'

@ApiBearerAuth('bearer')
@ApiTags('recipient')
@Controller('/recipient')
export class DeleteRecipientController {
  constructor(
    private readonly deleteRecipientUseCase: DeleteRecipientUseCase,
  ) {}

  @Delete(':Id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiOperation({ summary: 'Delete recipient (Admin Only)' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(@Param('Id') recipientId: string) {
    const result = await this.deleteRecipientUseCase.execute({
      Id: recipientId,
    })

    if (result.isLeft()) {
      const error: Error = result.value as Error
      if (error instanceof NotFoundError) throw new NotFoundError(error.message)
      if (error instanceof NotAllowedError)
        throw new ForbiddenException(error.message)
      throw new BadRequestException(error.message)
    }
  }
}
