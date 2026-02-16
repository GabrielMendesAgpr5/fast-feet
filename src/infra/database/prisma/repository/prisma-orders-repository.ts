import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { IOrdersRepository } from '@/domain/fastfeet/application/repositories/orders-repository'
import {
  Order,
  OrderStatusEnum,
} from '@/domain/fastfeet/enterprise/entities/order'
import { PrismaOrdersMapper } from '../mappers/prisma-orders-mapper'
import { OrderStatus, Prisma } from '@prisma/client'
import { Recipient } from '@/domain/fastfeet/enterprise/entities/recipient'
import { PrismaRecipientsMapper } from '../mappers/prisma-recipients-mapper'

@Injectable()
export class PrismaOrdersRepository implements IOrdersRepository {
  async findPendingWithRecipients(): Promise<
    Array<{ order: Order; recipient: Recipient }>
  > {
    const ordersData = await this.prisma.order.findMany({
      where: {
        status: OrderStatusEnum.PENDING,
      },
      include: {
        recipient: true,
      },
    })

    return ordersData.map((orderData) => ({
      order: PrismaOrdersMapper.toDomain(orderData),
      recipient: PrismaRecipientsMapper.toDomain(orderData.recipient),
    }))
  }
  constructor(private prisma: PrismaService) {}

  async findNearbyOrders(
    latitude: number,
    longitude: number,
    radiusInKm: number = 10,
    status?: OrderStatusEnum,
  ): Promise<Order[]> {
    const radiusInMeters = radiusInKm * 1000

    return this.prisma.$queryRaw`
    SELECT *, 
      ST_Distance(
        ST_MakePoint(longitude, latitude)::geography,
        ST_MakePoint(${longitude}, ${latitude})::geography
      ) as distance
    FROM orders
    WHERE ST_DWithin(
      ST_MakePoint(longitude, latitude)::geography,
      ST_MakePoint(${longitude}, ${latitude})::geography,
      ${radiusInMeters}
    )
    ${status ? Prisma.sql`AND status = ${status}` : Prisma.empty}
    ORDER BY distance
  `
  }

  async findByRecipient(recipientId: string): Promise<Order | null> {
    const prismaOrder = await this.prisma.order.findFirst({
      where: {
        recipientId: recipientId,
      },
    })

    if (!prismaOrder) {
      return null
    }

    return PrismaOrdersMapper.toDomain(prismaOrder)
  }
  async delete(orderId: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id: orderId },
    })
  }
  async findByDeliverymanId(
    deliverymanId: string,
    status?: OrderStatusEnum,
  ): Promise<Order[]> {
    const prismaOrders = await this.prisma.order.findMany({
      where: {
        deliverymanId: deliverymanId,
        ...(status && { status: status as OrderStatus }),
      },
    })

    return prismaOrders.map((prismaOrder) =>
      PrismaOrdersMapper.toDomain(prismaOrder),
    )
  }

  async findByStatus(status?: OrderStatusEnum): Promise<Order[]> {
    const prismaOrders = await this.prisma.order.findMany({
      where: { ...(status && { status: status as OrderStatus }) },
    })

    return prismaOrders.map((prismaOrder) =>
      PrismaOrdersMapper.toDomain(prismaOrder),
    )
  }

  async findById(orderId: string): Promise<Order | null> {
    const prismaOrder = await this.prisma.order.findFirst({
      where: { id: orderId },
    })
    if (!prismaOrder) {
      return null
    }

    return PrismaOrdersMapper.toDomain(prismaOrder)
  }

  async create(order: Order): Promise<Order> {
    const prismaOrder = PrismaOrdersMapper.toPrisma(order)

    const created = await this.prisma.order.create({
      data: prismaOrder,
    })

    return PrismaOrdersMapper.toDomain(created)
  }

  async update(order: Order): Promise<Order> {
    const dataToUpdate = PrismaOrdersMapper.toPrismaUpdate(order)

    const updated = await this.prisma.order.update({
      where: { id: order.id.toString() },
      data: dataToUpdate,
    })

    return PrismaOrdersMapper.toDomain(updated)
  }
}
