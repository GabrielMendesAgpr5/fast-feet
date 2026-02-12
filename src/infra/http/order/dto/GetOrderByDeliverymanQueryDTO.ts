import { ApiPropertyOptional } from '@nestjs/swagger'
import { OrderStatusEnum } from '@/domain/fastfeet/enterprise/entities/order'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import z from 'zod'

const GetOrdersByDeliverymanSchema = z.object({
  status: z.enum(OrderStatusEnum).optional(),
})

export const validateGetOrdersByDeliverymanDTO = new ZodValidationPipe(
  GetOrdersByDeliverymanSchema,
)

type GetOrdersByDeliverymanQueryDTOType = z.infer<
  typeof GetOrdersByDeliverymanSchema
>

export class GetOrdersByDeliverymanQueryDTO implements GetOrdersByDeliverymanQueryDTOType {
  @ApiPropertyOptional({ enum: OrderStatusEnum })
  status?: OrderStatusEnum
}
