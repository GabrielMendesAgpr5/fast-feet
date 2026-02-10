import { Either, left, right } from '@/core/either'
import { IOrdersRepository } from '../../repositories/orders-repository'
import { Injectable } from '@nestjs/common'
import { Order } from '@/domain/fastfeet/enterprise/entities/order'
import { NotFoundError } from '@/core/errors/use-case-errors/not-found-error'

export interface IGetOrdersByDeliverymanDTO {
  deliverymanId: string
}

type GetOrdersByDeliverymanResponseUseCase = Either<
  NotFoundError,
  {
    order: Order
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
    )
    if (!orders) return left(new NotFoundError('Orders Not Found'))

    return right({ order: orders })
  }
}
