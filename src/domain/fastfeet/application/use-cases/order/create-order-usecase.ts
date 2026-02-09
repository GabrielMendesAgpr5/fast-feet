import { Either, left, right } from '@/core/either'
import { IOrdersRepository } from '../../repositories/orders-repository'
import { Injectable } from '@nestjs/common'
import { ConflictError } from '@/core/errors/use-case-errors/conflict-error'
import {
  Order,
  OrderStatusEnum,
} from '@/domain/fastfeet/enterprise/entities/order'

export interface ICreateOrderDTO {
  id: string
  product: string
  recipientId: string
}

type CreateOrderResponseUseCase = Either<
  ConflictError,
  {
    order: Order
  }
>

@Injectable()
export class CreateOrderUseCase {
  constructor(private ordersRepository: IOrdersRepository) {}

  async execute(data: ICreateOrderDTO): Promise<CreateOrderResponseUseCase> {
    const orderAlreadyExists = await this.ordersRepository.findById(data.id)
    if (orderAlreadyExists) {
      return left(new ConflictError('This Order already exists'))
    }

    const order = Order.create({
      ...data,
      status: OrderStatusEnum.WAITING,
      availableAt: new Date(),
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
