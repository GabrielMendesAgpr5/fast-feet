import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { User, UserRoleEnum } from '@/domain/fastfeet/enterprise/entities/user'
import { Prisma, User as PrismaUser } from '@prisma/client'

export class PrismaUsersMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        name: raw.name,
        cpf: raw.cpf,
        password: raw.password,
        role: raw.role as UserRoleEnum,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(user: User): Prisma.UserCreateInput {
    return {
      id: user.id.toString(),
      name: user.name,
      cpf: user.cpf,
      password: user.password,
      createdAt: user.createdAt,
    }
  }
}
