import { Module } from '@nestjs/common'
import { CreateUserUseCase } from '@/domain/fastfeet/application/use-cases/users/create-user-usecase'
import { IUsersRepository } from '@/domain/fastfeet/application/repositories/users-repository'
import { PrismaUsersRepository } from './prisma/repository/prisma-users-repository'
import { PrismaService } from './prisma/prisma.service'
import { IOrdersRepository } from '@/domain/fastfeet/application/repositories/orders-repository'
import { PrismaOrdersRepository } from './prisma/repository/prisma-orders-repository'
import { CreateOrderUseCase } from '@/domain/fastfeet/application/use-cases/orders/create-order-usecase'

@Module({
  providers: [
    PrismaService,
    {
      provide: IUsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: IOrdersRepository,
      useClass: PrismaOrdersRepository,
    },
    CreateUserUseCase,
    CreateOrderUseCase,
  ],
  exports: [IUsersRepository, IOrdersRepository],
})
export class DataBaseModule {}
