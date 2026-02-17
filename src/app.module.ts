import { Module } from '@nestjs/common'
import { AuthModule } from './infra/auth/auth.module'
import { UserModule } from './infra/http/controller/user/user.module'
import { OrderModule } from './infra/http/order/order.module'
import { RecipientModule } from './infra/http/controller/recipient/recipient.module'

@Module({
  imports: [AuthModule, UserModule, RecipientModule, OrderModule],
})
export class AppModule {}
