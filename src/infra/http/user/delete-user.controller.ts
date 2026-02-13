import {
  Controller,
  HttpCode,
  HttpStatus,
  ForbiddenException,
  BadRequestException,
  UseGuards,
  Delete,
  Param,
  NotFoundException,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { DeleteUserUseCase } from '@/domain/fastfeet/application/use-cases/users/delete-user-usecase'
import { NotAllowedError } from '@/core/errors/use-case-errors/not-allowed-error'
import { UserRoleEnum } from '@/domain/fastfeet/enterprise/entities/user'
import { Roles } from '@/infra/auth/roles.decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { NotFoundError } from '@/core/errors/use-case-errors/not-found-error'

@ApiBearerAuth('bearer')
@ApiTags('user')
@Controller('/user')
export class DeleteUserController {
  constructor(private readonly deleteUserUseCase: DeleteUserUseCase) {}

  @Delete(':Id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiOperation({ summary: 'Delete user (Admin Only)' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(@Param('Id') userId: string) {
    const result = await this.deleteUserUseCase.execute({ Id: userId })

    if (result.isLeft()) {
      const error: Error = result.value as Error
      if (error instanceof NotFoundError)
        throw new NotFoundException(error.message)
      if (error instanceof NotAllowedError)
        throw new ForbiddenException(error.message)
      throw new BadRequestException(error.message)
    }
  }
}
