import { Either, left, right } from '@/core/either'
import { NotFoundError } from '@/core/errors/use-case-errors/not-found-error'
import { Injectable } from '@nestjs/common'
import { IUsersRepository } from '../../repositories/users-repository'
import { NotAllowedError } from '@/core/errors/use-case-errors/not-allowed-error'
import { IOrdersRepository } from '../../repositories/orders-repository'

export interface IDeleteUserDTO {
  Id: string
}

type DeleteUserResponseUseCase = Either<NotFoundError | NotAllowedError, null>

@Injectable()
export class DeleteUserUseCase {
  constructor(
    private userRepository: IUsersRepository,
    private ordersRepository: IOrdersRepository,
  ) {}

  async execute(data: IDeleteUserDTO): Promise<DeleteUserResponseUseCase> {
    const user = await this.userRepository.findById(data.Id)
    if (!user) return left(new NotFoundError('User not found'))

    if (user.isAdmin())
      return left(new NotAllowedError('Cannot delete admin users'))

    const hasActiveOrders = await this.ordersRepository.findByDeliverymanId(
      user.id.toString(),
    )
    if (hasActiveOrders.length > 0) {
      return left(new NotAllowedError('Cannot delete user with order'))
    }

    await this.userRepository.delete(user.id.toString())

    return right(null)
  }
}
