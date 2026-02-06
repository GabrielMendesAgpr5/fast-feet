import { User as PrismaUser } from '@prisma/client'
import { User, UserRoleEnum } from '@/domain/fastfeet/enterprise/entities/user'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export class PrismaUsersMapper {
  static toDomain(prismaUser: PrismaUser): User {
    return User.reconstitute(
      {
        name: prismaUser.name,
        cpf: prismaUser.cpf,
        password: prismaUser.password,
        role: prismaUser.role as UserRoleEnum,
        createdAt: prismaUser.createdAt,
        updatedAt: prismaUser.updatedAt ?? undefined,
      },
      new UniqueEntityId(prismaUser.id),
    )
  }

  static toPrisma(user: User) {
    return {
      id: user.id.toString(),
      name: user.name,
      cpf: user.cpf,
      password: user.password,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt ?? new Date(),
    }
  }

  static toPrismaUpdate(user: User) {
    return {
      name: user.name,
      cpf: user.cpf,
      password: user.password,
      role: user.role,
    }
  }
}
