import { Module } from '@nestjs/common'
import { CreateUserController } from './create-user.controller'
import { CreateUserUseCase } from '@/domain/fastfeet/application/use-cases/users/create-user-usecase'
import { DataBaseModule } from '@/infra/database/database.module'
import { EnvModule } from '@/infra/env/env.module'
import { UpdateUserController } from './update-user.controller'
import { UpdateUserUseCase } from '@/domain/fastfeet/application/use-cases/users/update-user-usecase'
import { DeleteOrderController } from '../order/delete-order.controller'
import { DeleteOrderUseCase } from '@/domain/fastfeet/application/use-cases/orders/delete-order-usecase'

@Module({
  imports: [DataBaseModule, EnvModule],
  controllers: [
    CreateUserController,
    UpdateUserController,
    DeleteOrderController,
  ],
  providers: [CreateUserUseCase, UpdateUserUseCase, DeleteOrderUseCase],
})
export class UserModule {}
