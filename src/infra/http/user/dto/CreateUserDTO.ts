import { ApiProperty } from '@nestjs/swagger'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { z } from 'zod'

const createUserSchema = z.object({
  name: z.string().min(3).max(30),
  cpf: z.string().regex(/^\d{11}$/, 'CPF must be 11 digits'),
  password: z.string().min(6).max(20),
})

export const validateCreateUserDTO = new ZodValidationPipe(createUserSchema)

type CreateUserDTOType = z.infer<typeof createUserSchema>

export class CreateUserDTO implements CreateUserDTOType {
  @ApiProperty()
  name!: string
  @ApiProperty()
  cpf!: string
  @ApiProperty()
  password!: string
}
