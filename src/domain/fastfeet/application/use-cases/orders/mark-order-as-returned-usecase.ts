import { Either, left, right } from '@/core/either'
import { IOrdersRepository } from '../../repositories/orders-repository'
import { Injectable } from '@nestjs/common'
import { NotAllowedError } from '@/core/errors/use-case-errors/not-allowed-error'
import {
  Order,
  OrderStatusEnum,
} from '@/domain/fastfeet/enterprise/entities/order'
import { NotFoundError } from '@/core/errors/use-case-errors/not-found-error'

export interface IMarkOrderAsReturnedDTO {
  orderId: string
  deliverymanId: string
}

type MarkOrderAsReturnedResponseUseCase = Either<
  NotAllowedError | NotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class MarkOrderAsReturnedUseCase {
  constructor(private orderRepository: IOrdersRepository) {}

  async execute(
    data: IMarkOrderAsReturnedDTO,
  ): Promise<MarkOrderAsReturnedResponseUseCase> {
    const order = await this.orderRepository.findById(data.orderId)
    if (!order) return left(new NotFoundError('Order not found'))

    if (order.status !== OrderStatusEnum.DELIVERED) {
      return left(new NotAllowedError('Only delivered orders can be returned'))
    }

    order.status = OrderStatusEnum.RETURNED
    order.returnedAt = new Date()
    //envia notificação

    await this.orderRepository.update(order)
    return right({ order })
  }
}
