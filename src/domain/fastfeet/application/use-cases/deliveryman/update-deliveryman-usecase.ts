import { Either, left, right } from '@/core/either'
import { ConflictError } from '@/core/errors/use-case-errors/conflict-error'
import { NotAllowedError } from '@/core/errors/use-case-errors/not-allowed-error'
import { NotFoundError } from '@/core/errors/use-case-errors/not-found-error'
import { Injectable } from '@nestjs/common'
import { IUsersRepository } from '../../repositories/users-repository'
import { User } from '@/domain/fastfeet/enterprise/entities/user'

export interface IUpdateUserDTO {
  adminId: string
  id: string
  name: string
}

type UpdateUserResponseUseCase = Either<
  NotAllowedError | ConflictError,
  {
    user: User
  }
>

@Injectable()
export class UpdateDelivererUseCase {
  constructor(private userRepository: IUsersRepository) {}

  async execute(data: IUpdateUserDTO): Promise<UpdateUserResponseUseCase> {
    const admin = await this.userRepository.findById(data.adminId)
    if (!admin || !User.isAdmin(admin.role)) {
      return left(new NotAllowedError('Only admins can update deliverers'))
    }

    const user = await this.userRepository.findById(data.id)
    if (!user) {
      return left(new NotFoundError('Deliverer not found'))
    }

    if (!User.isDeliveryman(user.role)) {
      return left(new NotAllowedError('User is not a deliverer'))
    }

    await this.userRepository.update(user)
    return right({ user })
  }
}
