import { Module } from '@nestjs/common'
import { AuthModule } from './infra/auth/auth.module'
import { UserModule } from './infra/http/user/user.module'
import { OrderModule } from './infra/http/order/order.module'
import { RecipientModule } from './infra/http/recipient/recipient.module'

@Module({
  imports: [AuthModule, UserModule, RecipientModule, OrderModule],
})
export class AppModule {}
