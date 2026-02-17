import { ApiProperty } from '@nestjs/swagger'
import { ZodValidationPipe } from '../../../pipes/zod-validation-pipe'
import { z } from 'zod'

const AssignDeliverymanToOrderSchema = z.object({
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
  deliverymanId!: string
}
