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
import { IUsersRepository } from '../../repositories/users-repository'

export interface IAssignDeliverymanToOrderDTO {
  orderId: string
  deliverymanId: string
}

type AssignDeliverymanToOrderResponseUseCase = Either<
  NotAllowedError | NotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class AssignDeliverymanToOrderUseCase {
  constructor(
    private orderRepository: IOrdersRepository,
    private notificationService: NotificationService,
    private userRepository: IUsersRepository,
  ) {}

  async execute(
    data: IAssignDeliverymanToOrderDTO,
  ): Promise<AssignDeliverymanToOrderResponseUseCase> {
    const order = await this.orderRepository.findById(data.orderId)
    if (!order) return left(new NotFoundError('Order not found'))

    if (order.status !== OrderStatusEnum.PENDING) {
      return left(new NotAllowedError('Only pending orders can be assigned'))
    }
    const previousStatus = order.status

    const user = await this.userRepository.findById(data.deliverymanId)
    if (!user) return left(new NotFoundError('Deliveryman not found'))

    if (!user.isDeliveryman()) {
      return left(
        new NotAllowedError('Only deliverymen can be assigned to orders'),
      )
    }

    order.deliverymanId = data.deliverymanId
    order.status = OrderStatusEnum.WITHDRAWN
    order.withdrawnAt = new Date()

    await this.orderRepository.update(order)

    await this.notificationService.sendOrderStatusNotification(
      order,
      previousStatus,
      OrderStatusEnum.WITHDRAWN,
    )
    return right({ order })
  }
}
