import { Module } from '@nestjs/common'
import { AuthModule } from './infra/auth/auth.module'
import { UserModule } from './infra/http/user/user.module'

@Module({
  imports: [AuthModule, UserModule],
})
export class AppModule {}
