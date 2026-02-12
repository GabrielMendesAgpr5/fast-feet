import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export enum OrderStatusEnum {
  WAITING = 'WAITING',
  PENDING = 'PENDING',
  WITHDRAWN = 'WITHDRAWN',
  DELIVERED = 'DELIVERED',
  RETURNED = 'RETURNED',
}

export interface OrderProps {
  product: string
  status: OrderStatusEnum
  availableAt: Date | null
  withdrawnAt: Date | null
  deliveredAt: Date | null
  returnedAt: Date | null
  recipientId: string
  deliverymanId: string | null
  signatureId: string | null
  createdAt?: Date
  updatedAt?: Date
}

export class Order extends Entity<OrderProps> {
  get product() {
    return this.props.product
  }

  set product(product: string) {
    this.props.product = product
    this.touch()
  }

  get status() {
    return this.props.status
  }

  set status(status: OrderStatusEnum) {
    this.props.status = status
    this.touch()
  }

  get availableAt() {
    return this.props.availableAt
  }

  set availableAt(date: Date | null) {
    this.props.availableAt = date
    this.touch()
  }

  get withdrawnAt() {
    return this.props.withdrawnAt
  }

  set withdrawnAt(date: Date | null) {
    this.props.withdrawnAt = date
    this.touch()
  }

  get deliveredAt() {
    return this.props.deliveredAt
  }

  set deliveredAt(date: Date | null) {
    this.props.deliveredAt = date
    this.touch()
  }

  get returnedAt() {
    return this.props.returnedAt
  }

  set returnedAt(date: Date | null) {
    this.props.returnedAt = date
    this.touch()
  }

  get recipientId() {
    return this.props.recipientId
  }

  get deliverymanId() {
    return this.props.deliverymanId
  }

  set deliverymanId(deliverymanId: string | null) {
    this.props.deliverymanId = deliverymanId
    this.touch()
  }

  get signatureId() {
    return this.props.signatureId
  }

  set signatureId(signatureId: string | null) {
    this.props.signatureId = signatureId
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Omit<OrderProps, 'createdAt' | 'updatedAt'> & {
      createdAt?: Date
      updatedAt?: Date
    },
    id?: UniqueEntityId,
  ) {
    const now = new Date()
    const order = new Order(
      {
        ...props,
        createdAt: props.createdAt ?? now,
        updatedAt: props.updatedAt ?? now,
      },
      id,
    )

    return order
  }
}
