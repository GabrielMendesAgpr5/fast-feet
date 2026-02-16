import { ApiProperty } from '@nestjs/swagger'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { z } from 'zod'

const createOrderSchema = z.object({
  product: z.string().min(3).max(40),
  recipientId: z.string(),
})

export const validateCreateOrderDTO = new ZodValidationPipe(createOrderSchema)

type CreateOrderDTOType = z.infer<typeof createOrderSchema>

export class CreateOrderDTO implements CreateOrderDTOType {
  @ApiProperty()
  product!: string
  @ApiProperty()
  recipientId!: string
}
