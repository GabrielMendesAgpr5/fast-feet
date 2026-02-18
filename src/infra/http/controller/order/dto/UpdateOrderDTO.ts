import { ApiPropertyOptional } from '@nestjs/swagger'
import { ZodValidationPipe } from '../../../pipes/zod-validation-pipe'
import { z } from 'zod'
import { OrderStatusEnum } from '@/domain/fastfeet/enterprise/entities/order'

export const updateOrderSchema = z
  .object({
    product: z.string().min(3).max(100).nullable(),
    status: z.enum(OrderStatusEnum),
    deliverymanId: z.string().nullable(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Submit at least one field to update.',
  })

export const validateUpdateOrderDTO = new ZodValidationPipe(updateOrderSchema)

type UpdateOrderDTOType = z.infer<typeof updateOrderSchema>

export class UpdateOrderDTO implements UpdateOrderDTOType {
  @ApiPropertyOptional()
  product?: string
  @ApiPropertyOptional()
  status?: OrderStatusEnum
  @ApiPropertyOptional()
  deliverymanId?: string
}
