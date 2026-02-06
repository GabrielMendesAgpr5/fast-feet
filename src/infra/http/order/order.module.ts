import { Module } from '@nestjs/common'
import { CreateOrderController } from './create-order.controller'
import { CreateOrderUseCase } from '@/domain/fastfeet/application/use-cases/order/create-order-usecase'
import { DataBaseModule } from '@/infra/database/database.module'
import { EnvModule } from '@/infra/env/env.module'

@Module({
  imports: [DataBaseModule, EnvModule],
  controllers: [CreateOrderController],
  providers: [CreateOrderUseCase],
})
export class OrderModule {}
