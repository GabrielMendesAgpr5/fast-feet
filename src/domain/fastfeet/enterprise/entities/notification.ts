export interface NotificationProps {
  id: string
  content: string
  recipientId: string
  createdAt: Date
  updatedAt: Date | null
}

export class Notification {
  private readonly _id: string
  private props: NotificationProps

  constructor(props: NotificationProps, id?: string) {
    this.props = props
    this._id = id ?? props.id
  }

  public get id() {
    return this._id
  }

  public get content() {
    return this.props.content
  }

  public set content(value: string) {
    this.props.content = value
    this.touch()
  }

  public get recipientId() {
    return this.props.recipientId
  }

  public set recipientId(value: string) {
    this.props.recipientId = value
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

  public static create(
    props: Omit<NotificationProps, 'createdAt' | 'updatedAt'>,
    id?: string,
  ) {
    const now = new Date()
    return new Notification(
      {
        ...props,
        createdAt: now,
        updatedAt: now,
      },
      id,
    )
  }
}
