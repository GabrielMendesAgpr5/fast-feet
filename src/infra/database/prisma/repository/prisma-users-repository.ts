import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { IUsersRepository } from '@/domain/fastfeet/application/repositories/users-repository'
import { PrismaUsersMapper } from '../mappers/prisma-users-mapper'
import { User } from '@/domain/fastfeet/enterprise/entities/user'

@Injectable()
export class PrismaUsersRepository implements IUsersRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    const prismaUser = PrismaUsersMapper.toPrisma(user)

    const created = await this.prisma.user.create({
      data: prismaUser,
    })

    return PrismaUsersMapper.toDomain(created)
  }

  async update(user: User): Promise<User> {
    const prismaUser = PrismaUsersMapper.toPrisma(user)

    const updated = await this.prisma.user.update({
      where: { id: prismaUser.id },
      data: prismaUser,
    })

    return PrismaUsersMapper.toDomain(updated)
  }

  async findByCpf(cpf: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { cpf },
    })

    if (!prismaUser) {
      return null
    }

    return PrismaUsersMapper.toDomain(prismaUser)
  }
}
