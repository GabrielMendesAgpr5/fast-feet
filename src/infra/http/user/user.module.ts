import { Module } from '@nestjs/common'
import { CreateUserController } from './create-user.controller'
import { CreateUserUseCase } from '@/domain/fastfeet/application/use-cases/user/create-user-usecase'
import { DataBaseModule } from '@/infra/database/database.module'
import { EnvModule } from '@/infra/env/env.module'

@Module({
  imports: [DataBaseModule, EnvModule],
  controllers: [CreateUserController],
  providers: [CreateUserUseCase],
})
export class UserModule {}
