import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { ApiProperty } from '@nestjs/swagger'
import z from 'zod'

const authLoginSchema = z.object({
  cpf: z.string().regex(/^\d{11}$/, 'CPF must be 11 digits'),
  password: z.string().min(6).max(20),
})

export const validateAuthLoginDTO = new ZodValidationPipe(authLoginSchema)

export class AuthLoginDTO {
  @ApiProperty()
  cpf!: string
  @ApiProperty()
  password!: string
}
