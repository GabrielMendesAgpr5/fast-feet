import { Either, right, left } from '@/core/either'
import { IOrdersRepository } from '../../repositories/orders-repository'
import { Injectable } from '@nestjs/common'
import {
  Order,
  OrderStatusEnum,
} from '@/domain/fastfeet/enterprise/entities/order'
import { IRecipientsRepository } from '../../repositories/recipients-repository'
import { NotFoundError } from '@/core/errors/use-case-errors/not-found-error'

export interface ICreateOrderDTO {
  product: string
  recipientId: string
}

type CreateOrderResponseUseCase = Either<
  NotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private ordersRepository: IOrdersRepository,
    private recipientsRepository: IRecipientsRepository,
  ) {}

  async execute(data: ICreateOrderDTO): Promise<CreateOrderResponseUseCase> {
    const recipientExists = await this.recipientsRepository.findById(
      data.recipientId,
    )
    if (!recipientExists) {
      return left(new NotFoundError('Recipient not found'))
    }

    const order = Order.create({
      ...data,
      status: OrderStatusEnum.WAITING,
      availableAt: null,
      withdrawnAt: null,
      deliveredAt: null,
      returnedAt: null,
      deliverymanId: null,
      signatureId: null,
    })

    await this.ordersRepository.create(order)
    return right({ order })
  }
}
