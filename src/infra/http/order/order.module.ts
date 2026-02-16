import { Module } from '@nestjs/common'
import { CreateOrderController } from './create-order.controller'
import { CreateOrderUseCase } from '@/domain/fastfeet/application/use-cases/orders/create-order-usecase'
import { DataBaseModule } from '@/infra/database/database.module'
import { EnvModule } from '@/infra/env/env.module'
import { AssignDeliverymanToOrderController } from './assign-deliveryman-to-order.controller'
import { GetOrdersByDeliverymanController } from './get-orders-by-deliveryman.controller'
import { MarkOrderAsDeliveredController } from './mark-order-as-delivered.controller'
import { MarkOrderAsReturnedController } from './mark-order-as-returned.controller'
import { AssignDeliverymanToOrderUseCase } from '@/domain/fastfeet/application/use-cases/orders/assign-deliveryman-to-order-usecase'
import { GetOrdersByDeliverymanUseCase } from '@/domain/fastfeet/application/use-cases/orders/get-orders-by-deliveryman-usecase'
import { MarkOrderAsDeliveredUseCase } from '@/domain/fastfeet/application/use-cases/orders/mark-order-as-delivered-usecase'
import { MarkOrderAsReturnedUseCase } from '@/domain/fastfeet/application/use-cases/orders/mark-order-as-returned-usecase'
import { PickupOrderController } from './pickup-order.controller'
import { DeleteOrderController } from './delete-order.controller'
import { DeleteOrderUseCase } from '@/domain/fastfeet/application/use-cases/orders/delete-order-usecase'
import { MarkOrderAsPendingController } from './mark-order-as-pending.controller'
import { MarkOrderAsPendingUseCase } from '@/domain/fastfeet/application/use-cases/orders/mark-order-as-pending-usecase'
import { GetOrdersByStatusController } from './get-orders-by-status.controller'
import { GetOrdersByStatusUseCase } from '@/domain/fastfeet/application/use-cases/orders/get-orders-by-status-usecase'
import { GetNearbyOrdersController } from './get-nearby-orders.controller'
import { GetNearbyOrdersUseCase } from '@/domain/fastfeet/application/use-cases/orders/get-nearby-orders-usecase'
import { NotificationService } from '@/domain/fastfeet/application/notification/notification.service'

@Module({
  imports: [DataBaseModule, EnvModule],
  controllers: [
    CreateOrderController,
    GetOrdersByDeliverymanController,
    GetOrdersByStatusController,
    GetNearbyOrdersController,
    AssignDeliverymanToOrderController,
    MarkOrderAsPendingController,
    MarkOrderAsDeliveredController,
    MarkOrderAsReturnedController,
    PickupOrderController,
    DeleteOrderController,
  ],
  providers: [
    CreateOrderUseCase,
    GetOrdersByDeliverymanUseCase,
    GetOrdersByStatusUseCase,
    GetNearbyOrdersUseCase,
    AssignDeliverymanToOrderUseCase,
    MarkOrderAsPendingUseCase,
    MarkOrderAsDeliveredUseCase,
    MarkOrderAsReturnedUseCase,
    DeleteOrderUseCase,
    NotificationService,
  ],
})
export class OrderModule {}
