import { Recipient } from '@/domain/fastfeet/enterprise/entities/recipient'

export interface IRecipientsFiltersDTO {
  id?: string
  name?: string
  email?: string
  city?: string
  state?: string
  latitude?: number
  longitude?: number
  distanceKm?: number
}

export abstract class IRecipientsRepository {
  abstract create(recipient: Recipient): Promise<Recipient>
  abstract findMany(filters: IRecipientsFiltersDTO): Promise<Recipient[]>
  abstract update(recipient: Recipient): Promise<Recipient>
  abstract delete(recipientId: string): Promise<void>
  abstract findById(recipientId: string): Promise<Recipient | null>
  abstract findByEmail(email: string): Promise<Recipient | null>
  abstract listNearbyLocation(
    latitude: number,
    longitude: number,
  ): Promise<Recipient[]>
}
