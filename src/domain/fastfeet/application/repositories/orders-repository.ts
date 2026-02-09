import {
  Order,
  OrderStatusEnum,
} from '@/domain/fastfeet/enterprise/entities/order'

export abstract class IOrdersRepository {
  abstract create(order: Order): Promise<Order>
  abstract update(order: Order): Promise<Order>
  abstract findById(OrderId: string): Promise<Order | null>
  abstract findByDeliverymanId(
    DeliverymanId: string,
    Status: OrderStatusEnum,
  ): Promise<Order | null>
}
