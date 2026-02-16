import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface NotificationProps {
  id: string
  title: string
  content: string
  recipientId: string
  readAt: Date | null
  createdAt: Date
}

export class Notification extends Entity<NotificationProps> {
  public get title() {
    return this.props.title
  }

  public set title(value: string) {
    this.props.title = value
  }

  public get content() {
    return this.props.content
  }

  public set content(value: string) {
    this.props.content = value
  }

  public get recipientId() {
    return this.props.recipientId
  }

  public set recipientId(value: string) {
    this.props.recipientId = value
  }

  public get readAt() {
    return this.props.readAt
  }

  public get createdAt() {
    return this.props.createdAt
  }

  public markAsRead() {
    this.props.readAt = new Date()
  }

  public static create(
    props: Omit<NotificationProps, 'createdAt' | 'updatedAt' | 'readAt'>,
    id?: UniqueEntityId,
  ) {
    const now = new Date()
    return new Notification(
      {
        ...props,
        readAt: null,
        createdAt: now,
      },
      id,
    )
  }
}
