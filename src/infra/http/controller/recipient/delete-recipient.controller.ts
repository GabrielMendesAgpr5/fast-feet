import {
  Controller,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UseGuards,
  Delete,
  Param,
  ConflictException,
  NotFoundException,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { UserRoleEnum } from '@/domain/fastfeet/enterprise/entities/user'
import { Roles } from '@/infra/auth/roles.decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { DeleteRecipientUseCase } from '@/domain/fastfeet/application/use-cases/recipients/delete-recipient-usecase'
import { ConflictError } from '@/core/errors/use-case-errors/conflict-error'
import { NotFoundError } from '@/core/errors/use-case-errors/not-found-error'

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
      if (error instanceof ConflictError)
        throw new ConflictException(error.message)
      if (error instanceof NotFoundError)
        throw new NotFoundException(error.message)
      throw new BadRequestException(error.message)
    }

    return { message: 'Recipient deleted successfully' }
  }
}
