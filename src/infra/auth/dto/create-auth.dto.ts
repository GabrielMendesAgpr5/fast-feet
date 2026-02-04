import { UserRoleEnum } from '@/domain/fastfeet/enterprise/entities/user'

export class RegisterDto {
  name: string | undefined
  cpf: string | undefined
  password: string | undefined

  role: UserRoleEnum | undefined
}
