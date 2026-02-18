import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import {
  IRecipientsFiltersDTO,
  IRecipientsRepository,
} from '@/domain/fastfeet/application/repositories/recipients-repository'
import { Recipient } from '@/domain/fastfeet/enterprise/entities/recipient'
import { PrismaRecipientsMapper } from '../mappers/prisma-recipients-mapper'
import { Prisma } from '@prisma/client'

@Injectable()
export class PrismaRecipientRepository implements IRecipientsRepository {
  constructor(private prisma: PrismaService) {}
  async findMany(filters: IRecipientsFiltersDTO): Promise<Recipient[]> {
    const where: Prisma.RecipientWhereInput = {}

    if (filters.name) {
      where.name = { contains: filters.name, mode: 'insensitive' }
    }
    if (filters.email) {
      where.email = { contains: filters.email, mode: 'insensitive' }
    }
    if (filters.city) {
      where.city = { contains: filters.city, mode: 'insensitive' }
    }
    if (filters.state) {
      where.state = { equals: filters.state }
    }

    const results = await this.prisma.recipient.findMany({ where })
    return results.map((item) => PrismaRecipientsMapper.toDomain(item))
  }

  async findByEmail(email: string): Promise<Recipient | null> {
    const prismaRecipient = await this.prisma.recipient.findFirst({
      where: { email: email },
    })

    if (!prismaRecipient) {
      return null
    }

    return PrismaRecipientsMapper.toDomain(prismaRecipient)
  }

  async listNearbyLocation(): Promise<Recipient[]> {
    const prismaRecipient = await this.prisma.recipient.findMany()

    return prismaRecipient.map((prismaRecipient) =>
      PrismaRecipientsMapper.toDomain(prismaRecipient),
    )
  }

  async delete(recipientId: string): Promise<void> {
    await this.prisma.recipient.delete({
      where: { id: recipientId },
    })
  }

  async findById(recipientId: string): Promise<Recipient | null> {
    const prismaRecipient = await this.prisma.recipient.findUnique({
      where: { id: recipientId },
    })

    if (!prismaRecipient) {
      return null
    }

    return PrismaRecipientsMapper.toDomain(prismaRecipient)
  }

  async create(recipient: Recipient): Promise<Recipient> {
    const prismaRecipient = PrismaRecipientsMapper.toPrisma(recipient)

    const created = await this.prisma.recipient.create({
      data: prismaRecipient,
    })

    return PrismaRecipientsMapper.toDomain(created)
  }

  async update(recipient: Recipient): Promise<Recipient> {
    const dataToUpdate = PrismaRecipientsMapper.toPrismaUpdate(recipient)

    const updated = await this.prisma.recipient.update({
      where: { id: recipient.id.toString() },
      data: dataToUpdate,
    })

    return PrismaRecipientsMapper.toDomain(updated)
  }
}
