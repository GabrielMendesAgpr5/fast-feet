import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { AuthLoginDTO, validateAuthLoginDTO } from './dto/auth-login.dto'

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login and get access token' })
  @HttpCode(HttpStatus.OK)
  async login(@Body(validateAuthLoginDTO) dto: AuthLoginDTO) {
    return this.authService.login(dto)
  }
}
