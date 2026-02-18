import { ApiPropertyOptional } from '@nestjs/swagger'
import { ZodValidationPipe } from '../../../pipes/zod-validation-pipe'
import z from 'zod'
import { UserRoleEnum } from '@/domain/fastfeet/enterprise/entities/user'

const GetUsersByRoleSchema = z.object({
  role: z.enum(UserRoleEnum).optional(),
})

export const validateGetUsersByRoleDTO = new ZodValidationPipe(
  GetUsersByRoleSchema,
)

type GetUsersByRoleQueryDTOType = z.infer<typeof GetUsersByRoleSchema>

export class GetUsersByRoleQueryDTO implements GetUsersByRoleQueryDTOType {
  @ApiPropertyOptional({ enum: UserRoleEnum })
  role?: UserRoleEnum
}
