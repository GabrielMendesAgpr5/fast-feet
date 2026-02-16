import { Either, left, right } from '@/core/either'
import { IOrdersRepository } from '../../repositories/orders-repository'
import { IAttachmentsRepository } from '../../repositories/attachments-repository'
import { Injectable } from '@nestjs/common'
import { NotAllowedError } from '@/core/errors/use-case-errors/not-allowed-error'
import {
  Order,
  OrderStatusEnum,
} from '@/domain/fastfeet/enterprise/entities/order'
import { NotFoundError } from '@/core/errors/use-case-errors/not-found-error'
import { Attachment } from '@/domain/fastfeet/enterprise/entities/attachment'
import { NotificationService } from '../../notification/notification.service'

export interface IMarkOrderAsDeliveredDTO {
  orderId: string
  deliverymanId: string
  photoFilename: string
  photoPath: string
}

type MarkOrderAsDeliveredResponseUseCase = Either<
  NotAllowedError | NotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class MarkOrderAsDeliveredUseCase {
  constructor(
    private orderRepository: IOrdersRepository,
    private attachmentsRepository: IAttachmentsRepository,
    private notificationService: NotificationService,
  ) {}

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

    if (!data.photoFilename || !data.photoPath) {
      return left(new NotAllowedError('Photo is required to complete delivery'))
    }

    const attachment = Attachment.create({
      title: `Delivery proof - Order ${data.orderId}`,
      url: data.photoPath,
    })

    await this.attachmentsRepository.create(attachment)

    const previousStatus = order.status

    order.signatureId = attachment.id.toString()
    order.status = OrderStatusEnum.DELIVERED
    order.deliveredAt = new Date()

    await this.notificationService.sendOrderStatusNotification(
      order,
      previousStatus,
      OrderStatusEnum.DELIVERED,
    )

    await this.orderRepository.update(order)
    return right({ order })
  }
}
