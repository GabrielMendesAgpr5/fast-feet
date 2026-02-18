import { Either, left, right } from '@/core/either'
import { IUsersRepository } from '../../repositories/users-repository'
import { Injectable } from '@nestjs/common'
import { User, UserRoleEnum } from '@/domain/fastfeet/enterprise/entities/user'
import { NotFoundError } from '@/core/errors/use-case-errors/not-found-error'

export interface IGetUsersDTO {
  role?: UserRoleEnum
}

type GetUsersResponseUseCase = Either<
  NotFoundError,
  {
    users: User[]
  }
>

@Injectable()
export class GetUsersByRoleUseCase {
  constructor(private userRepository: IUsersRepository) {}

  async execute(role: IGetUsersDTO): Promise<GetUsersResponseUseCase> {
    const users = await this.userRepository.findAll(role.role)

    if (users.length === 0) {
      return left(new NotFoundError('No users found'))
    }

    return right({ users })
  }
}
