import { Either, left, right } from '@/core/either'
import { IOrdersRepository } from '../../repositories/orders-repository'
import { Injectable } from '@nestjs/common'
import { NotAllowedError } from '@/core/errors/use-case-errors/not-allowed-error'
import { ConflictError } from '@/core/errors/use-case-errors/conflict-error'
import {
  Order,
  OrderStatusEnum,
} from '@/domain/fastfeet/enterprise/entities/order'
import { NotFoundError } from '@/core/errors/use-case-errors/not-found-error'
import { ResourceNotFoundError } from '@/core/errors/use-case-errors/resource-not-found-error'

export interface IUpdateOrderDTO {
  id: string
  status: OrderStatusEnum
  deliverymanId: string
}

type UpdateOrderResponseUseCase = Either<
  NotAllowedError | ConflictError | ResourceNotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class UpdateOrderUseCase {
  constructor(private orderRepository: IOrdersRepository) {}

  async execute(data: IUpdateOrderDTO): Promise<UpdateOrderResponseUseCase> {
    const order = await this.orderRepository.findById(data.id)
    if (!order) return left(new NotFoundError('Order not found'))

    if (data.deliverymanId !== undefined) {
      order.deliverymanId = data.deliverymanId
      order.status = OrderStatusEnum.WITHDRAWN
      //envia notificação
    }

    if (data.status !== undefined) {
      if (data.status == OrderStatusEnum.DELIVERED)
        order.status = OrderStatusEnum.DELIVERED
      //envia notificação
      else if (data.status == OrderStatusEnum.RETURNED)
        order.status = OrderStatusEnum.RETURNED
      //envia notificação
      else
        return left(
          new ResourceNotFoundError(`Status: "${data.status}", not Found`),
        )
    }

    await this.orderRepository.update(order)
    return right({ order })
  }
}
