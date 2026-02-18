import {
  Order,
  OrderStatusEnum,
} from '@/domain/fastfeet/enterprise/entities/order'
import { Recipient } from '../../enterprise/entities/recipient'

export interface OrderWithDistanceDTO {
  order: Order
  distance: number
}

export abstract class IOrdersRepository {
  abstract create(order: Order): Promise<Order>
  abstract update(order: Order): Promise<Order>
  abstract delete(orderId: string): Promise<void>
  abstract findById(orderId: string): Promise<Order | null>
  abstract findByRecipient(recipientId: string): Promise<Order | null>
  abstract findByDeliverymanId(
    deliverymanId: string,
    status?: OrderStatusEnum,
  ): Promise<Order[]>
  abstract findByStatus(status?: OrderStatusEnum): Promise<Order[]>
  abstract findPendingWithRecipients(): Promise<
    Array<{ order: Order; recipient: Recipient }>
  >
}
