import {
  CreateUserUseCase,
  ICreateUserDTO,
} from '@/domain/fastfeet/application/use-cases/user/create-user-usecase'
import { IUsersRepository } from '@/domain/fastfeet/application/repositories/users-repository'
import { ConflictException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import bcrypt from 'node_modules/bcryptjs/umd/types'

@Injectable()
export class AuthService {
  constructor(
    private usersRepo: IUsersRepository,
    private jwtService: JwtService,
    private createUserUseCase: CreateUserUseCase,
  ) {}

  async register(data: ICreateUserDTO) {
    const result = await this.createUserUseCase.execute(data)
    if (result.isLeft()) {
      throw new ConflictException(result.value.message)
    }

    const user = result.value.user
    const payload = { sub: user.id, role: user.role }
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, name: user.name, role: user.role },
    }
  }

  async login(dto: ICreateUserDTO) {
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
