import { User } from '@/domain/fastfeet/enterprise/entities/user'
import { ApiProperty } from '@nestjs/swagger'

export class UserPresenterResponse {
  @ApiProperty()
  id!: string
  @ApiProperty()
  name!: string
  @ApiProperty()
  cpf!: string
}

export class UserPresenter {
  static toHTTP(user: User): UserPresenterResponse {
    return {
      id: user.id.toString(),
      name: user.name,
      cpf: user.cpf,
    }
  }
}
