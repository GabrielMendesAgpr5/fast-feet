import { ApiPropertyOptional } from '@nestjs/swagger'
import { ZodValidationPipe } from '../../../pipes/zod-validation-pipe'
import { z } from 'zod'
import { UserRoleEnum } from '@/domain/fastfeet/enterprise/entities/user'

export const updateUserSchema = z
  .object({
    name: z.string().min(3).max(30),
    role: z.enum(UserRoleEnum),
    password: z.string().min(6).max(20),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Envie ao menos um campo para atualizar',
  })

export const validateUpdateUserDTO = new ZodValidationPipe(updateUserSchema)

type UpdateUserDTOType = z.infer<typeof updateUserSchema>

export class UpdateUserDTO implements UpdateUserDTOType {
  @ApiPropertyOptional()
  name?: string
  @ApiPropertyOptional({ enum: UserRoleEnum, enumName: 'UserRoleEnum' })
  role?: UserRoleEnum
  @ApiPropertyOptional()
  password?: string
}
