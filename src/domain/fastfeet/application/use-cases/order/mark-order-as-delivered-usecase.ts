import { Either, left, right } from '@/core/either'
import { IOrdersRepository } from '../../repositories/orders-repository'
import { Injectable } from '@nestjs/common'
import { NotAllowedError } from '@/core/errors/use-case-errors/not-allowed-error'
import {
  Order,
  OrderStatusEnum,
} from '@/domain/fastfeet/enterprise/entities/order'
import { NotFoundError } from '@/core/errors/use-case-errors/not-found-error'

export interface IMarkOrderAsDeliveredDTO {
  orderId: string
  deliverymanId: string
}

type MarkOrderAsDeliveredResponseUseCase = Either<
  NotAllowedError | NotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class MarkOrderAsDeliveredUseCase {
  constructor(private orderRepository: IOrdersRepository) {}

  async execute(
    data: IMarkOrderAsDeliveredDTO,
  ): Promise<MarkOrderAsDeliveredResponseUseCase> {
    const order = await this.orderRepository.findById(data.orderId)
    if (!order) return left(new NotFoundError('Order Not Found'))

    if (order.status !== OrderStatusEnum.WITHDRAWN) {
      return left(new NotAllowedError('Only withdrawn orders can be delivered'))
    }

    if (order.deliverymanId !== data.deliverymanId) {
      return left(
        new NotAllowedError(
          'Only the deliveryman who picked up the package can deliver it',
        ),
      )
    }

    //Verifica se foi enviado uma foto

    order.status = OrderStatusEnum.DELIVERED
    //envia notificação

    await this.orderRepository.update(order)
    return right({ order })
  }
}
