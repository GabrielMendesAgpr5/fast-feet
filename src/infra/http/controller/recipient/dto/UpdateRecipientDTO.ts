import { ApiPropertyOptional } from '@nestjs/swagger'
import { ZodValidationPipe } from '../../../pipes/zod-validation-pipe'
import { z } from 'zod'

export const updateRecipientSchema = z
  .object({
    name: z.string().min(3).max(100),
    email: z.email().optional().nullable(),
    street: z.string().min(3),
    number: z
      .string()
      .regex(/^\d{1,6}$/, 'House number must be at most 6 digits'),
    complement: z.string().optional().nullable(),
    city: z.string().min(2),
    state: z.string().length(2, 'State must be 2 characters'),
    zipCode: z.string().regex(/^\d{5}-?\d{3}$/, 'Invalid ZIP code format'),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Envie ao menos um campo para atualizar',
  })

export const validateUpdateRecipientDTO = new ZodValidationPipe(
  updateRecipientSchema,
)

type UpdateRecipientDTOType = z.infer<typeof updateRecipientSchema>

export class UpdateRecipientDTO implements UpdateRecipientDTOType {
  @ApiPropertyOptional()
  name?: string
  @ApiPropertyOptional()
  city?: string
  @ApiPropertyOptional()
  complement?: string
  @ApiPropertyOptional()
  email?: string
  @ApiPropertyOptional()
  number?: string
  @ApiPropertyOptional()
  state?: string
  @ApiPropertyOptional()
  street?: string
  @ApiPropertyOptional()
  zipCode?: string
}
