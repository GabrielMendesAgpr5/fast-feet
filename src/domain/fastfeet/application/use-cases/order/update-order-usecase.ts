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

export interface IUpdateOrderDTO {
  id: string
  status: OrderStatusEnum
  deliveryman: string
  recipientId: string
}

type UpdateOrderResponseUseCase = Either<
  NotAllowedError | ConflictError,
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

    if (data.deliveryman !== undefined) order.deliveryman = data.deliveryman
    if (data.role !== undefined) user.role = data.role
    if (data.password !== undefined) {
      const hashedPassword = await bcrypt.hash(data.password, 12)
      user.password = hashedPassword
    }

    await this.userRepository.update(user)
    return right({ user })
  }
}
