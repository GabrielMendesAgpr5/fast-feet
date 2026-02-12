import { Prisma, Recipient as PrismaRecipient } from '@prisma/client'
import { Recipient } from '@/domain/fastfeet/enterprise/entities/recipient'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Coordinates } from '@/domain/fastfeet/enterprise/value-objects/coordinates'

export class PrismaRecipientsMapper {
  static toDomain(prismaRecipient: PrismaRecipient): Recipient {
    return Recipient.create(
      {
        name: prismaRecipient.name,
        createdAt: prismaRecipient.createdAt,
        updatedAt: prismaRecipient.updatedAt,
        number: prismaRecipient.number,
        email: prismaRecipient.email,
        street: prismaRecipient.street,
        complement: prismaRecipient.complement,
        city: prismaRecipient.city,
        state: prismaRecipient.state,
        zipCode: prismaRecipient.zipCode,
        coordinates: Coordinates.create(
          prismaRecipient.latitude.toNumber(),
          prismaRecipient.longitude.toNumber(),
        ),
      },
      new UniqueEntityId(prismaRecipient.id),
    )
  }

  static toPrisma(recipient: Recipient) {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      email: recipient.email,
      street: recipient.street,
      number: recipient.number,
      complement: recipient.complement,
      city: recipient.city,
      state: recipient.state,
      zipCode: recipient.zipCode,
      latitude: new Prisma.Decimal(recipient.coordinates.latitude),
      longitude: new Prisma.Decimal(recipient.coordinates.longitude),
      createdAt: recipient.createdAt,
      updatedAt: recipient.updatedAt,
    }
  }

  static toPrismaUpdate(recipient: Recipient) {
    return {
      name: recipient.name,
      email: recipient.email,
      street: recipient.street,
      number: recipient.number,
      complement: recipient.complement,
      city: recipient.city,
      state: recipient.state,
      zipCode: recipient.zipCode,
      latitude: new Prisma.Decimal(recipient.coordinates.latitude),
      longitude: new Prisma.Decimal(recipient.coordinates.longitude),
      updatedAt: new Date(),
    }
  }
}
