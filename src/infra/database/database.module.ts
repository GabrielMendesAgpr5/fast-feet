import { Module } from '@nestjs/common'
import { CreateUserUseCase } from '@/domain/fastfeet/application/use-cases/user/create-user-usecase'
import { IUsersRepository } from '@/domain/fastfeet/application/repositories/users-repository'
import { PrismaUsersRepository } from './prisma/repository/prisma-users-repository'
import { PrismaService } from './prisma/prisma.service'

@Module({
  providers: [
    PrismaService,
    {
      provide: IUsersRepository,
      useClass: PrismaUsersRepository,
    },
    CreateUserUseCase,
  ],
  exports: [IUsersRepository],
})
export class DataBaseModule {}
