import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/use-case-errors/not-allowed-error'
import { NotFoundError } from '@/core/errors/use-case-errors/not-found-error'
import { Injectable } from '@nestjs/common'
import { IUsersRepository } from '../../repositories/users-repository'
import { User, UserRoleEnum } from '@/domain/fastfeet/enterprise/entities/user'
import * as bcrypt from 'bcryptjs'

export interface IUpdateUserDTO {
  id: string
  name?: string
  role?: UserRoleEnum
  password?: string
}

type UpdateUserResponseUseCase = Either<
  NotAllowedError | NotFoundError,
  {
    user: User
  }
>

@Injectable()
export class UpdateUserUseCase {
  constructor(private userRepository: IUsersRepository) {}

  async execute(data: IUpdateUserDTO): Promise<UpdateUserResponseUseCase> {
    const user = await this.userRepository.findById(data.id)
    if (!user) return left(new NotFoundError('User not found'))

    if (!user.isDeliveryman()) {
      return left(new NotAllowedError('Only deliverymen can be updated'))
    }

    if (data.name !== undefined) user.name = data.name
    if (data.role !== undefined) user.role = data.role
    if (data.password !== undefined) {
      const hashedPassword = await bcrypt.hash(data.password, 12)
      user.password = hashedPassword
    }

    await this.userRepository.update(user)
    return right({ user })
  }
}
