import { IUsersRepository } from '@/domain/fastfeet/application/repositories/users-repository'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthLoginDTO } from './dto/auth-login.dto'
import bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
  constructor(
    private usersRepo: IUsersRepository,
    private jwtService: JwtService,
  ) {}

  async login(dto: AuthLoginDTO) {
    const user = await this.usersRepo.findByCpf(dto.cpf)
    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password')
    }

    const payload = { sub: user.id.toString(), role: user.role }
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id.toString(), name: user.name, role: user.role },
    }
  }
}
