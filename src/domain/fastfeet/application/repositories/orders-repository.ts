import { Order } from '@/domain/fastfeet/enterprise/entities/order'

export abstract class IOrdersRepository {
  abstract create(order: Order): Promise<Order>
  abstract update(order: Order): Promise<Order>
  abstract findById(orderId: string): Promise<Order | null>
  abstract findByDeliverymanId(deliverymanId: string): Promise<Order | null>
}
