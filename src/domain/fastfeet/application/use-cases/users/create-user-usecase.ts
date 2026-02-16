import { Either, left, right } from '@/core/either'
import { IUsersRepository } from '../../repositories/users-repository'
import { User, UserRoleEnum } from '@/domain/fastfeet/enterprise/entities/user'
import { Injectable } from '@nestjs/common'
import { NotAllowedError } from '@/core/errors/use-case-errors/not-allowed-error'
import { ConflictError } from '@/core/errors/use-case-errors/conflict-error'
import bcrypt from 'bcryptjs'

export interface ICreateUserDTO {
  name: string
  cpf: string
  password: string
}

type CreateUserResponseUseCase = Either<
  NotAllowedError | ConflictError,
  {
    user: User
  }
>

@Injectable()
export class CreateUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute(data: ICreateUserDTO): Promise<CreateUserResponseUseCase> {
    const userAlreadyExists = await this.usersRepository.findByCpf(data.cpf)
    if (userAlreadyExists) {
      return left(new ConflictError('This CPF is already in use'))
    }

    const isValidCpf = true
    if (!isValidCpf) {
      return left(new NotAllowedError('Invalid CPF format'))
    }

    const hashedPassword = await bcrypt.hash(data.password, 12)
    const user = User.create({
      ...data,
      password: hashedPassword,
      role: UserRoleEnum.DELIVERYMAN,
    })

    await this.usersRepository.create(user)
    return right({ user })
  }
}
