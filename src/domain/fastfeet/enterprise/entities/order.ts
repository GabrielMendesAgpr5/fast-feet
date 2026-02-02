enum OrderStatusEnum {
  PENDING = 'PENDING',
  WITHDRAWN = 'WITHDRAWN',
  DELIVERED = 'DELIVERED',
  RETURNED = 'RETURNED',
}

export interface OrderProps {
  id: string
  product: string
  status: OrderStatusEnum
  availableAt: Date | null
  withdrawnAt: Date | null
  deliveredAt: Date | null
  returnedAt: Date | null
  recipientId: string
  deliverymanId: string | null
  signatureId: string | null
  createdAt: Date
  updatedAt: Date
}

export class Order {
  private readonly _id: string
  private props: OrderProps

  constructor(props: OrderProps, id?: string) {
    this.props = props
    this._id = id ?? props.id
  }

  public get id() {
    return this._id
  }

  public get product() {
    return this.props.product
  }

  set product(product: string) {
    this.props.product = product
    this.touch()
  }

  public get status() {
    return this.props.status
  }

  set status(status: OrderStatusEnum) {
    this.props.status = status
    this.touch()
  }

  public get availableAt() {
    return this.props.availableAt
  }

  set availableAt(date: Date | null) {
    this.props.availableAt = date
    this.touch()
  }

  public get withdrawnAt() {
    return this.props.withdrawnAt
  }

  set withdrawnAt(date: Date | null) {
    this.props.withdrawnAt = date
    this.touch()
  }

  public get deliveredAt() {
    return this.props.deliveredAt
  }

  set deliveredAt(date: Date | null) {
    this.props.deliveredAt = date
    this.touch()
  }

  public get returnedAt() {
    return this.props.returnedAt
  }

  set returnedAt(date: Date | null) {
    this.props.returnedAt = date
    this.touch()
  }

  public get recipientId() {
    return this.props.recipientId
  }

  public get deliverymanId() {
    return this.props.deliverymanId
  }

  set deliverymanId(deliverymanId: string | null) {
    this.props.deliverymanId = deliverymanId
    this.touch()
  }

  public get signatureId() {
    return this.props.signatureId
  }

  set signatureId(signatureId: string | null) {
    this.props.signatureId = signatureId
    this.touch()
  }

  public get createdAt() {
    return this.props.createdAt
  }

  public get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Omit<OrderProps, 'createdAt' | 'updatedAt'>,
    id?: string,
  ) {
    const now = new Date()
    const order = new Order(
      {
        ...props,
        createdAt: now,
        updatedAt: now,
      },
      id,
    )

    return order
  }
}
