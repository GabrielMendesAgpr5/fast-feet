import { Module } from '@nestjs/common'
import { AuthModule } from './infra/auth/auth.module'
import { UserModule } from './infra/http/user/user.module'
import { OrderModule } from './infra/http/order/order.module'

@Module({
  imports: [AuthModule, UserModule, OrderModule],
})
export class AppModule {}
