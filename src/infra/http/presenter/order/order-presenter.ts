import {
  Order,
  OrderStatusEnum,
} from '@/domain/fastfeet/enterprise/entities/order'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class OrderPresenterResponse {
  @ApiProperty()
  id!: string
  @ApiProperty()
  product!: string
  @ApiProperty()
  recipientId!: string
  @ApiPropertyOptional()
  deliverymanId?: string | null
  @ApiPropertyOptional()
  status?: OrderStatusEnum
}

export class OrderPresenter {
  static toHTTP(Order: Order): OrderPresenterResponse {
    return {
      id: Order.id.toString(),
      product: Order.product,
      recipientId: Order.recipientId,
      deliverymanId: Order.deliverymanId,
      status: Order.status,
    }
  }
}
