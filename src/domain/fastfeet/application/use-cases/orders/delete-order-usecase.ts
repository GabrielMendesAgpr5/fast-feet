import { Either, left, right } from '@/core/either'
import { NotFoundError } from '@/core/errors/use-case-errors/not-found-error'
import { Injectable } from '@nestjs/common'
import { NotAllowedError } from '@/core/errors/use-case-errors/not-allowed-error'
import { IOrdersRepository } from '../../repositories/orders-repository'

export interface IDeleteOrderDTO {
  Id: string
}

type DeleteOrderResponseUseCase = Either<NotFoundError | NotAllowedError, null>

@Injectable()
export class DeleteOrderUseCase {
  constructor(private ordersRepository: IOrdersRepository) {}

  async execute(data: IDeleteOrderDTO): Promise<DeleteOrderResponseUseCase> {
    const order = await this.ordersRepository.findById(data.Id)
    if (!order) return left(new NotFoundError('Order not found'))

    await this.ordersRepository.delete(order.id.toString())

    return right(null)
  }
}
