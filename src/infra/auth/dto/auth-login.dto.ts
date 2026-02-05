import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import z from 'zod'

const authLoginSchema = z.object({
  cpf: z.string().regex(/^\d{11}$/, 'CPF must be 11 digits'),
  password: z.string().min(6).max(20),
})

export const validateAuthLoginDTO = new ZodValidationPipe(authLoginSchema)

export class AuthLoginDTO {
  cpf!: string
  password!: string
}
