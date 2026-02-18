import { Either, left, right } from '@/core/either'
import { IOrdersRepository } from '../../repositories/orders-repository'
import { Injectable } from '@nestjs/common'
import { NotFoundError } from '@/core/errors/use-case-errors/not-found-error'
import { calculateDistance } from '../../geolocation/haversine'

export interface IGetNearbyOrdersDTO {
  latitude: number
  longitude: number
  maxDistanceKm?: number
}

export interface OrderWithDistance {
  orderId: string
  product: string
  distanceKm: number
}

type GetNearbyOrdersResponseUseCase = Either<
  NotFoundError,
  {
    orders: OrderWithDistance[]
  }
>

@Injectable()
export class GetNearbyOrdersUseCase {
  constructor(private orderRepository: IOrdersRepository) {}

  async execute(
    data: IGetNearbyOrdersDTO,
  ): Promise<GetNearbyOrdersResponseUseCase> {
    const pendingOrdersWithRecipients =
      await this.orderRepository.findPendingWithRecipients()

    if (pendingOrdersWithRecipients.length === 0) {
      return left(new NotFoundError('No pending orders found'))
    }

    const maxDistance = data.maxDistanceKm ?? 10

    const ordersWithDistance: OrderWithDistance[] = pendingOrdersWithRecipients
      .map(({ order, recipient }) => ({
        orderId: order.id.toString(),
        product: order.product,
        state: recipient.state,
        city: recipient.city,
        street: recipient.street,
        number: recipient.number,
        zipCode: recipient.zipCode,
        complement: recipient.complement,
        distanceKm: calculateDistance(
          data.latitude,
          data.longitude,
          recipient.latitude,
          recipient.longitude,
        ),
      }))
      .filter((item) => item.distanceKm <= maxDistance)
      .sort((a, b) => a.distanceKm - b.distanceKm)

    if (ordersWithDistance.length === 0) {
      return left(
        new NotFoundError(
          `No pending orders found within ${maxDistance}km of your location`,
        ),
      )
    }

    return right({ orders: ordersWithDistance })
  }
}
