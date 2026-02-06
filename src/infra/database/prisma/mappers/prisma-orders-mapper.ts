import { Order as PrismaOrder } from '@prisma/client'
import {
  Order,
  OrderStatusEnum,
} from '@/domain/fastfeet/enterprise/entities/order'

export class PrismaOrdersMapper {
  static toDomain(prismaOrder: PrismaOrder): Order {
    return Order.create({
      id: prismaOrder.id,
      product: prismaOrder.product,
      availableAt: prismaOrder.availableAt,
      status: prismaOrder.status as OrderStatusEnum,
      withdrawnAt: prismaOrder.withdrawnAt,
      deliveredAt: prismaOrder.deliveredAt,
      returnedAt: prismaOrder.returnedAt,
      recipientId: prismaOrder.recipientId,
      deliverymanId: prismaOrder.deliverymanId,
      signatureId: prismaOrder.signatureId,
    })
  }

  static toPrisma(order: Order) {
    return {
      id: order.id.toString(),
      product: order.product,
      availableAt: order.availableAt,
      status: order.status,
      withdrawnAt: order.withdrawnAt,
      deliveredAt: order.deliveredAt,
      returnedAt: order.returnedAt,
      recipientId: order.recipientId,
      deliverymanId: order.deliverymanId,
      signatureId: order.signatureId,
    }
  }

  static toPrismaUpdate(order: Order) {
    return {
      availabeAt: order.availableAt,
      status: order.status,
      withdrawnAt: order.withdrawnAt,
      deliveredAt: order.deliveredAt,
      returnedAt: order.returnedAt,
      deliverymanId: order.deliverymanId,
      signatureId: order.signatureId,
    }
  }
}
