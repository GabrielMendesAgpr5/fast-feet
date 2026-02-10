import { ApiProperty } from '@nestjs/swagger'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { z } from 'zod'

const MarkOrderAsDeliveredSchema = z.object({
  orderId: z.string(),
})

export const validateMarkOrderAsDeliveredDTO = new ZodValidationPipe(
  MarkOrderAsDeliveredSchema,
)

type MarkOrderAsDeliveredDTOType = z.infer<typeof MarkOrderAsDeliveredSchema>

export class MarkOrderAsDeliveredDTO implements MarkOrderAsDeliveredDTOType {
  @ApiProperty()
  orderId!: string
}
