import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { IUsersRepository } from '@/domain/fastfeet/application/repositories/users-repository'
import { PrismaUsersMapper } from '../mappers/prisma-users-mapper'
import { User, UserRoleEnum } from '@/domain/fastfeet/enterprise/entities/user'
import { UserRole } from '@prisma/client'

@Injectable()
export class PrismaUsersRepository implements IUsersRepository {
  constructor(private prisma: PrismaService) {}
  async findAll(role?: UserRoleEnum): Promise<User[]> {
    const prismaUsers = await this.prisma.user.findMany({
      where: {
        ...(role && { role: role as UserRole }),
      },
    })

    return prismaUsers.map((prismaUsers) =>
      PrismaUsersMapper.toDomain(prismaUsers),
    )
  }
  async delete(userId: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id: userId },
    })
  }

  async findById(userId: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!prismaUser) {
      return null
    }

    return PrismaUsersMapper.toDomain(prismaUser)
  }

  async create(user: User): Promise<User> {
    const prismaUser = PrismaUsersMapper.toPrisma(user)

    const created = await this.prisma.user.create({
      data: prismaUser,
    })

    return PrismaUsersMapper.toDomain(created)
  }

  async update(user: User): Promise<User> {
    const dataToUpdate = PrismaUsersMapper.toPrismaUpdate(user)

    const updated = await this.prisma.user.update({
      where: { id: user.id.toString() },
      data: dataToUpdate,
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
