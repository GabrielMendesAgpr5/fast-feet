import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { IOrdersRepository } from '@/domain/fastfeet/application/repositories/orders-repository'
import { Order } from '@/domain/fastfeet/enterprise/entities/order'
import { PrismaOrdersMapper } from '../mappers/prisma-orders-mapper'

@Injectable()
export class PrismaOrdersRepository implements IOrdersRepository {
  constructor(private prisma: PrismaService) {}
  async findById(orderId: string): Promise<Order | null> {
    const prismaOrder = await this.prisma.order.findUnique({
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

  async findByDeliveryman(deliverymanId: string): Promise<Order | null> {
    const prismaOrder = await this.prisma.order.findUnique({
      where: { id: deliverymanId },
    })
    if (!prismaOrder) {
      return null
    }

    return PrismaOrdersMapper.toDomain(prismaOrder)
  }
}
