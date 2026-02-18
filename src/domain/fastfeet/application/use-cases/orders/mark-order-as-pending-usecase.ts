import { Either, left, right } from '@/core/either'
import { IOrdersRepository } from '../../repositories/orders-repository'
import { Injectable } from '@nestjs/common'
import { NotAllowedError } from '@/core/errors/use-case-errors/not-allowed-error'
import {
  Order,
  OrderStatusEnum,
} from '@/domain/fastfeet/enterprise/entities/order'
import { NotFoundError } from '@/core/errors/use-case-errors/not-found-error'
import { NotificationService } from '../../notification/notification.service'

export interface IMarkOrderAsPendingDTO {
  orderId: string
}

type MarkOrderAsPendingResponseUseCase = Either<
  NotAllowedError | NotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class MarkOrderAsPendingUseCase {
  constructor(
    private orderRepository: IOrdersRepository,
    private notificationService: NotificationService,
  ) {}

  async execute(
    data: IMarkOrderAsPendingDTO,
  ): Promise<MarkOrderAsPendingResponseUseCase> {
    const order = await this.orderRepository.findById(data.orderId)
    if (!order) return left(new NotFoundError('Order Not Found'))

    if (order.status !== OrderStatusEnum.WAITING) {
      return left(
        new NotAllowedError('Only waiting requests can remain pending'),
      )
    }
    const previousStatus = order.status

    order.status = OrderStatusEnum.PENDING
    order.availableAt = new Date()

    await this.notificationService.sendOrderStatusNotification(
      order,
      previousStatus,
      OrderStatusEnum.PENDING,
    )

    await this.orderRepository.update(order)
    return right({ order })
  }
}
