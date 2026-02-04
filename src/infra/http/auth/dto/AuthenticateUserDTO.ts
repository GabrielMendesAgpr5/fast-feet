import { ApiProperty } from '@nestjs/swagger'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { z } from 'zod'

const AuthenticateUserSchema = z.object({
  cpf: z.string().regex(/^\d{11}$/, 'CPF must be 11 digits'),
  password: z.string().min(6).max(20),
})

export const validateAuthenticateUserDTO = new ZodValidationPipe(
  AuthenticateUserSchema,
)

type AuthenticateUserDTOType = z.infer<typeof AuthenticateUserSchema>

export class AuthenticateUserDTO implements AuthenticateUserDTOType {
  @ApiProperty()
  cpf!: string
  @ApiProperty()
  password!: string
}
