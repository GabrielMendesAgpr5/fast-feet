import { Either, left, right } from '@/core/either'
import { IOrdersRepository } from '../../repositories/orders-repository'
import { Injectable } from '@nestjs/common'
import {
  Order,
  OrderStatusEnum,
} from '@/domain/fastfeet/enterprise/entities/order'
import { NotFoundError } from '@/core/errors/use-case-errors/not-found-error'

export interface IGetOrdersByDeliverymanDTO {
  deliverymanId: string
  status?: OrderStatusEnum
}

type GetOrdersByDeliverymanResponseUseCase = Either<
  NotFoundError,
  {
    orders: Order[]
  }
>

@Injectable()
export class GetOrdersByDeliverymanUseCase {
  constructor(private orderRepository: IOrdersRepository) {}

  async execute(
    data: IGetOrdersByDeliverymanDTO,
  ): Promise<GetOrdersByDeliverymanResponseUseCase> {
    const orders = await this.orderRepository.findByDeliverymanId(
      data.deliverymanId,
      data.status,
    )

    if (orders.length === 0) {
      return left(new NotFoundError('No orders found for this deliveryman'))
    }

    return right({ orders })
  }
}
