import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import {
  AuthenticateUserDTO,
  validateAuthenticateUserDTO,
} from './dto/AuthenticateUserDTO'
import { UnauthorizedError } from '@/core/errors/use-case-errors/unauthorized-error'
import { AuthGuard } from '@nestjs/passport'

@ApiBearerAuth()
@ApiTags('user')
@Controller('/authenticate')
export class AuthenticateController {
  constructor(private readonly authUserUseCase: AuthUserUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Authenticate a user' })
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  async handle(@Body(validateAuthenticateUserDTO) dto: AuthenticateUserDTO) {
    const { cpf, password } = dto

    const result = await this.authUserUseCase.execute({ cpf, password })

    if (result.isLeft()) {
      const error: Error = result.value as Error
      throw new UnauthorizedError(error.message)
    }

    const { token } = result.value
    return { token }
  }
}
