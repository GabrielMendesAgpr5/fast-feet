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
import { CreateUserDTO, validateCreateUserDTO } from './dto/CreateUserDTO'
import { CreateUserUseCase } from '@/domain/fastfeet/application/use-cases/user/create-user-usecase'
import { ConflictError } from '@/core/errors/use-case-errors/conflict-error'
import { NotAllowedError } from '@/core/errors/use-case-errors/not-allowed-error'
import { UserRoleEnum } from '@/domain/fastfeet/enterprise/entities/user'
import { Roles } from '@/infra/auth/roles-decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'

@ApiBearerAuth('bearer')
@ApiTags('user')
@Controller('/user')
export class CreateUserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiOperation({ summary: 'Create a new user' })
  @HttpCode(HttpStatus.CREATED)
  async handle(@Body(validateCreateUserDTO) dto: CreateUserDTO) {
    const { name, cpf, password } = dto

    const result = await this.createUserUseCase.execute({
      name,
      cpf,
      password,
    })

    if (result.isLeft()) {
      const error: Error = result.value as Error
      if (error instanceof ConflictError)
        throw new ConflictException(error.message)
      if (error instanceof NotAllowedError)
        throw new ForbiddenException(error.message)
      throw new BadRequestException(error.message)
    }

    const { user } = result.value
    return {
      id: user.id,
      name: user.name,
      cpf: user.cpf,
    }
  }
}
