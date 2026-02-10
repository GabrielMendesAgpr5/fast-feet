import { ApiProperty } from '@nestjs/swagger'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { z } from 'zod'

const GetOrdersByDeliverymanSchema = z.object({
  deliverymanId: z.string(),
})

export const validateGetOrdersByDeliverymanDTO = new ZodValidationPipe(
  GetOrdersByDeliverymanSchema,
)

type GetOrdersByDeliverymanDTOType = z.infer<
  typeof GetOrdersByDeliverymanSchema
>

export class GetOrdersByDeliverymanDTO implements GetOrdersByDeliverymanDTOType {
  @ApiProperty()
  deliverymanId!: string
}
