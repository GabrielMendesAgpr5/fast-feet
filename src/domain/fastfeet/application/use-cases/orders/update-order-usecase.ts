import { Either, left, right } from '@/core/either'
import { NotFoundError } from '@/core/errors/use-case-errors/not-found-error'
import {
  Order,
  OrderStatusEnum,
} from '@/domain/fastfeet/enterprise/entities/order'
import { Injectable } from '@nestjs/common'
import { IOrdersRepository } from '../../repositories/orders-repository'
import { IUsersRepository } from '../../repositories/users-repository'

export interface IUpdateOrderDTO {
  id: string
  product?: string
  status?: OrderStatusEnum
  deliverymanId?: string
}

type UpdateOrderResponseUseCase = Either<
  NotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class UpdateOrderUseCase {
  constructor(
    private orderRepository: IOrdersRepository,
    private userRepository: IUsersRepository,
  ) {}

  async execute(data: IUpdateOrderDTO): Promise<UpdateOrderResponseUseCase> {
    const order = await this.orderRepository.findById(data.id)
    if (!order) return left(new NotFoundError('Order not found'))

    if (data.product !== undefined) order.product = data.product
    if (data.status !== undefined) order.status = data.status
    if (data.deliverymanId !== undefined) {
      const deliveryman = await this.userRepository.findById(data.deliverymanId)
      if (!deliveryman) return left(new NotFoundError('Deliveryman not found'))

      order.deliverymanId = data.deliverymanId
    }

    await this.orderRepository.update(order)
    return right({ order: order })
  }
}
