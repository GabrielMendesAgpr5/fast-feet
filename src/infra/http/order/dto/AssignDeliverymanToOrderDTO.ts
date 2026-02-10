import { ApiProperty } from '@nestjs/swagger'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { z } from 'zod'

const AssignDeliverymanToOrderSchema = z.object({
  orderId: z.string(),
  deliverymanId: z.string(),
})

export const validateAssignDeliverymanToOrderDTO = new ZodValidationPipe(
  AssignDeliverymanToOrderSchema,
)

type AssignDeliverymanToOrderDTOType = z.infer<
  typeof AssignDeliverymanToOrderSchema
>

export class AssignDeliverymanToOrderDTO implements AssignDeliverymanToOrderDTOType {
  @ApiProperty()
  orderId!: string
  @ApiProperty()
  deliverymanId!: string
}
