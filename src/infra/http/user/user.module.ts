import { Module } from '@nestjs/common'
import { CreateUserController } from './create-user.controller'
import { CreateUserUseCase } from '@/domain/fastfeet/application/use-cases/user/create-user-usecase'
import { DataBaseModule } from '@/infra/database/database.module'
import { EnvModule } from '@/infra/env/env.module'
import { UpdateUserController } from './update-user.controller'
import { UpdateUserUseCase } from '@/domain/fastfeet/application/use-cases/user/update-user-usecase'

@Module({
  imports: [DataBaseModule, EnvModule],
  controllers: [CreateUserController, UpdateUserController],
  providers: [CreateUserUseCase, UpdateUserUseCase],
})
export class UserModule {}
