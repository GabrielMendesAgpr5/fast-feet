import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { Order } from '../entities/order'

export class OrderStatusChangedEvent implements DomainEvent {
  public ocurredAt: Date
  public order: Order
  public previousStatus: string
  public newStatus: string

  constructor(order: Order, previousStatus: string, newStatus: string) {
    this.order = order
    this.previousStatus = previousStatus
    this.newStatus = newStatus
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.order.id
  }
}
