import { Order } from '@/domain/fastfeet/enterprise/entities/order'
import { ApiProperty } from '@nestjs/swagger'

export class OrderPresenterResponse {
  @ApiProperty()
  id!: string
  @ApiProperty()
  product!: string
  @ApiProperty()
  recipientId!: string
}

export class OrderPresenter {
  static toHTTP(Order: Order): OrderPresenterResponse {
    return {
      id: Order.id.toString(),
      product: Order.product,
      recipientId: Order.recipientId,
    }
  }
}
