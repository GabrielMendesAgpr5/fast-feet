import { Module } from '@nestjs/common'
import { CreateUserUseCase } from '@/domain/fastfeet/application/use-cases/users/create-user-usecase'
import { IUsersRepository } from '@/domain/fastfeet/application/repositories/users-repository'
import { PrismaUsersRepository } from './prisma/repository/prisma-users-repository'
import { PrismaService } from './prisma/prisma.service'
import { IOrdersRepository } from '@/domain/fastfeet/application/repositories/orders-repository'
import { PrismaOrdersRepository } from './prisma/repository/prisma-orders-repository'
import { CreateOrderUseCase } from '@/domain/fastfeet/application/use-cases/orders/create-order-usecase'
import { IRecipientsRepository } from '@/domain/fastfeet/application/repositories/recipients-repository'
import { CreateRecipientUseCase } from '@/domain/fastfeet/application/use-cases/recipients/create-recipient-usecase'
import { PrismaRecipientRepository } from './prisma/repository/prisma-recipient-repository'
import { GeolocationModule } from '../http/geolocation/geolocation.module'
import { IAttachmentsRepository } from '@/domain/fastfeet/application/repositories/attachments-repository'
import { PrismaAttachmentsRepository } from './prisma/repository/prisma-attachments-repository'
import { INotificationsRepository } from '@/domain/fastfeet/application/repositories/notifications-repository'
import { PrismaNotificationsRepository } from './prisma/repository/prisma-notifications-repository'

@Module({
  imports: [GeolocationModule],
  providers: [
    PrismaService,
    {
      provide: IUsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: IRecipientsRepository,
      useClass: PrismaRecipientRepository,
    },
    {
      provide: IOrdersRepository,
      useClass: PrismaOrdersRepository,
    },
    {
      provide: INotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
    {
      provide: IAttachmentsRepository,
      useClass: PrismaAttachmentsRepository,
    },
    CreateUserUseCase,
    CreateRecipientUseCase,
    CreateOrderUseCase,
  ],
  exports: [
    IUsersRepository,
    IRecipientsRepository,
    IOrdersRepository,
    IAttachmentsRepository,
    INotificationsRepository,
  ],
})
export class DataBaseModule {}
