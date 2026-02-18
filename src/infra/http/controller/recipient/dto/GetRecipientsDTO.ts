import { z } from 'zod'
import { ZodValidationPipe } from '../../../pipes/zod-validation-pipe'
import { ApiPropertyOptional } from '@nestjs/swagger'

export const GetRecipientsSchema = z.object({
  name: z.string().optional(),
  email: z.email().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
})

export const validateGetRecipientsDTO = new ZodValidationPipe(
  GetRecipientsSchema,
)
export type GetRecipientsQueryDTO = z.infer<typeof GetRecipientsSchema>

export class GetRecipientsSwaggerDTO {
  @ApiPropertyOptional({
    description: 'Nome do destinatário (filtro parcial)',
    example: 'João Silva',
  })
  name?: string

  @ApiPropertyOptional({
    description: 'Email do destinatário (filtro parcial)',
    example: 'joao@email.com',
  })
  email?: string

  @ApiPropertyOptional({
    description: 'Rua/endereço',
    example: 'Rua das Flores, 123',
  })
  street?: string

  @ApiPropertyOptional({
    description: 'Cidade (filtro parcial)',
    example: 'Criciúma',
  })
  city?: string

  @ApiPropertyOptional({
    description: 'Estado (UF)',
    example: 'SC',
    pattern: '^[A-Z]{2}$',
  })
  state?: string
}
