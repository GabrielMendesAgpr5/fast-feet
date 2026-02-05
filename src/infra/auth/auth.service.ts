import { IUsersRepository } from '@/domain/fastfeet/application/repositories/users-repository'
import { ConflictException, Injectable } from '@nestjs/common'
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
      throw new ConflictException('User not found')
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password)
    if (!isPasswordValid) {
      throw new ConflictException('Invalid password')
    }

    const payload = { sub: user.id, role: user.role }
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, name: user.name, role: user.role },
    }
  }
}
