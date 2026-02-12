import { Order as PrismaOrder } from '@prisma/client'
import {
  Order,
  OrderStatusEnum,
} from '@/domain/fastfeet/enterprise/entities/order'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { OrderStatus } from '@prisma/client'

export class PrismaOrdersMapper {
  static toPrismaStatus(status: OrderStatusEnum): OrderStatus {
    return status as unknown as OrderStatus
  }

  static toDomainStatus(status: OrderStatus): OrderStatusEnum {
    return status as unknown as OrderStatusEnum
  }
  static toDomain(prismaOrder: PrismaOrder): Order {
    return Order.create(
      {
        product: prismaOrder.product,
        status: this.toDomainStatus(prismaOrder.status),
        availableAt: prismaOrder.availableAt,
        withdrawnAt: prismaOrder.withdrawnAt,
        deliveredAt: prismaOrder.deliveredAt,
        returnedAt: prismaOrder.returnedAt,
        recipientId: prismaOrder.recipientId,
        deliverymanId: prismaOrder.deliverymanId,
        signatureId: prismaOrder.signatureId,
        createdAt: prismaOrder.createdAt,
        updatedAt: prismaOrder.updatedAt,
      },
      new UniqueEntityId(prismaOrder.id),
    )
  }

  static toPrisma(order: Order) {
    return {
      id: order.id.toString(),
      product: order.product,
      status: this.toPrismaStatus(order.status),
      availableAt: order.availableAt,
      withdrawnAt: order.withdrawnAt,
      deliveredAt: order.deliveredAt,
      returnedAt: order.returnedAt,
      recipientId: order.recipientId,
      deliverymanId: order.deliverymanId,
      signatureId: order.signatureId,
      createdAt: order.createdAt!,
      updatedAt: order.updatedAt!,
    }
  }

  static toPrismaUpdate(order: Order) {
    return {
      product: order.product,
      status: this.toPrismaStatus(order.status),
      availableAt: order.availableAt,
      withdrawnAt: order.withdrawnAt,
      deliveredAt: order.deliveredAt,
      returnedAt: order.returnedAt,
      deliverymanId: order.deliverymanId,
      signatureId: order.signatureId,
      updatedAt: new Date(),
    }
  }
}
