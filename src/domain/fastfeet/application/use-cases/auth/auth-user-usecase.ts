import { Either, left, right } from '@/core/either'
import { IUsersRepository } from '../../repositories/users-repository'
import { User } from '@/domain/fastfeet/enterprise/entities/user'
import { Injectable } from '@nestjs/common'
import { NotAllowedError } from '@/core/errors/use-case-errors/not-allowed-error'
import { ConflictError } from '@/core/errors/use-case-errors/conflict-error'
import bcrypt from 'node_modules/bcryptjs'

export interface IAuthUserDTO {
  cpf: string
  password: string
}

type AuthUserResponseUseCase = Either<
  NotAllowedError | ConflictError,
  {
    user: User
  }
>

@Injectable()
export class AuthUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute(data: IAuthUserDTO): Promise<AuthUserResponseUseCase> {
    const userAlreadyExists = await this.usersRepository.findByCpf(data.cpf)
    if (!userAlreadyExists) {
      return left(new ConflictError('This CPF is not registered'))
    }

    const isValidCpf = true // TODO: validação de CPF
    if (!isValidCpf) {
      return left(new NotAllowedError('Invalid CPF format'))
    }

    const hashedPassword = await bcrypt.hash(data.password, 12)
    const user = User.create({
        ...data,
        password: hashedPassword,
        name: '',
    })

    await this.usersRepository.create(user)
    return right({ user })
  }
}
