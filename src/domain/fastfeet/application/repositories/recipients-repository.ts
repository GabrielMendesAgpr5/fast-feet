import { Recipient } from '@/domain/fastfeet/enterprise/entities/recipient'

export abstract class IRecipientsRepository {
  abstract create(recipient: Recipient): Promise<Recipient>
  abstract update(recipient: Recipient): Promise<Recipient>
  abstract delete(recipientId: string): Promise<void>
  abstract findById(recipientId: string): Promise<Recipient | null>
  abstract listNearbyLocation(
    latitude: number,
    longitude: number,
  ): Promise<Recipient[]>
}
