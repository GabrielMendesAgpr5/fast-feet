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
import { UpdateUserUseCase } from '@/domain/fastfeet/application/use-cases/user/update-user-usecase'
import { NotAllowedError } from '@/core/errors/use-case-errors/not-allowed-error'
import { UserRoleEnum } from '@/domain/fastfeet/enterprise/entities/user'
import { Roles } from '@/infra/auth/roles-decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { UpdateUserDTO, validateUpdateUserDTO } from './dto/UpdateUserDTO'
import { NotFoundError } from '@/core/errors/use-case-errors/not-found-error'

@ApiBearerAuth('bearer')
@ApiTags('user')
@Controller('/user')
export class UpdateUserController {
  constructor(private readonly updateUserUseCase: UpdateUserUseCase) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', type: String })
  @HttpCode(HttpStatus.OK)
  async handle(
    @Param('id') id: string,
    @Body(validateUpdateUserDTO) dto: UpdateUserDTO,
  ) {
    const result = await this.updateUserUseCase.execute({ id, ...dto })

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
