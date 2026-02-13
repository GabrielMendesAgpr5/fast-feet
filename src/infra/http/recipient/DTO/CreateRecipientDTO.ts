import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { z } from 'zod'

const createRecipientSchema = z.object({
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
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
})

export const validateCreateRecipientDTO = new ZodValidationPipe(
  createRecipientSchema,
)

type CreateRecipientDTOType = z.infer<typeof createRecipientSchema>

export class CreateRecipientDTO implements CreateRecipientDTOType {
  @ApiProperty({ example: 'João Silva' })
  name!: string

  @ApiPropertyOptional({ example: 'joao@example.com', nullable: true })
  email!: string | null

  @ApiProperty({ example: 'Rua das Flores' })
  street!: string

  @ApiProperty({ example: '123' })
  number!: string

  @ApiPropertyOptional({ example: 'Apto 45', nullable: true })
  complement!: string | null

  @ApiProperty({ example: 'Criciúma' })
  city!: string

  @ApiProperty({ example: 'SC' })
  state!: string

  @ApiProperty({ example: '88800-000' })
  zipCode!: string

  @ApiPropertyOptional({ example: -28.6773, description: 'Latitude' })
  latitude?: number

  @ApiPropertyOptional({ example: -49.3699, description: 'Longitude' })
  longitude?: number
}
