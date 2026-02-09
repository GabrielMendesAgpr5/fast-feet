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
  status: OrderStatusEnum
}

type GetOrdersByDeliverymanResponseUseCase = Either<
  NotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class MarkOrderAsDeliveredUseCase {
  constructor(private orderRepository: IOrdersRepository) {}

  async execute(
    data: IGetOrdersByDeliverymanDTO,
  ): Promise<GetOrdersByDeliverymanResponseUseCase> {
    const orders = await this.orderRepository.findByDeliverymanId(
      data.deliverymanId,
      data.status,
    )
    if (!orders) return left(new NotFoundError('Orders Not Found'))

    return right({ order: orders })
  }
}
