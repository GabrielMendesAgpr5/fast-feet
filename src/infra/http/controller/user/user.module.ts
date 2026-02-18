import { Module } from '@nestjs/common'
import { CreateUserController } from './create-user.controller'
import { CreateUserUseCase } from '@/domain/fastfeet/application/use-cases/users/create-user-usecase'
import { DataBaseModule } from '@/infra/database/database.module'
import { EnvModule } from '@/infra/env/env.module'
import { UpdateUserController } from './update-user.controller'
import { UpdateUserUseCase } from '@/domain/fastfeet/application/use-cases/users/update-user-usecase'
import { DeleteUserUseCase } from '@/domain/fastfeet/application/use-cases/users/delete-user-usecase'
import { DeleteUserController } from './delete-user.controller'
import { GetUsersByRoleController } from './get-users-by-role.controller'
import { GetUsersByRoleUseCase } from '@/domain/fastfeet/application/use-cases/users/get-user-by-role-usecase'

@Module({
  imports: [DataBaseModule, EnvModule],
  controllers: [
    CreateUserController,
    UpdateUserController,
    DeleteUserController,
    GetUsersByRoleController,
  ],
  providers: [
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    GetUsersByRoleUseCase,
  ],
})
export class UserModule {}
