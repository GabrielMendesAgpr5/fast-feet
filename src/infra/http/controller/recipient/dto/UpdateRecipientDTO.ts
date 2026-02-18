import { ApiPropertyOptional } from '@nestjs/swagger'
import { ZodValidationPipe } from '../../../pipes/zod-validation-pipe'
import { z } from 'zod'

export const updateRecipientSchema = z
  .object({
    name: z.string().min(3).max(100),
    email: z.email().optional().nullable(),
    street: z.string().min(3),
    city: z.string().min(2),
    state: z.string().length(2, 'State must be 2 characters'),
    zipCode: z.string().regex(/^\d{5}-?\d{3}$/, 'Invalid ZIP code format'),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Submit at least one field to update.',
  })

export const validateUpdateRecipientDTO = new ZodValidationPipe(
  updateRecipientSchema,
)

type UpdateRecipientDTOType = z.infer<typeof updateRecipientSchema>

export class UpdateRecipientDTO implements UpdateRecipientDTOType {
  @ApiPropertyOptional()
  name?: string
  @ApiPropertyOptional()
  email?: string
  @ApiPropertyOptional()
  city?: string
  @ApiPropertyOptional()
  state?: string
  @ApiPropertyOptional()
  street?: string
  @ApiPropertyOptional()
  zipCode?: string
  @ApiPropertyOptional()
  latitude?: number
  @ApiPropertyOptional()
  longitude?: number
}
