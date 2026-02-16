import { Either, left, right } from '@/core/either'
import { IOrdersRepository } from '../../repositories/orders-repository'
import { Injectable } from '@nestjs/common'
import {
  Order,
  OrderStatusEnum,
} from '@/domain/fastfeet/enterprise/entities/order'
import { NotFoundError } from '@/core/errors/use-case-errors/not-found-error'

export interface IGetOrdersByStatusDTO {
  status?: OrderStatusEnum
}

type GetOrdersByStatusResponseUseCase = Either<
  NotFoundError,
  {
    orders: Order[]
  }
>

@Injectable()
export class GetOrdersByStatusUseCase {
  constructor(private orderRepository: IOrdersRepository) {}

  async execute(
    data: IGetOrdersByStatusDTO,
  ): Promise<GetOrdersByStatusResponseUseCase> {
    const orders = await this.orderRepository.findByStatus(data.status)

    if (orders.length === 0) {
      return left(new NotFoundError('No orders found with this status'))
    }

    return right({ orders })
  }
}
