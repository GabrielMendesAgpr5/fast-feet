// src/domain/fastfeet/enterprise/entities/attachment.ts
import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface AttachmentProps {
  title: string
  url: string
  createdAt: Date
  updatedAt: Date
}

export class Attachment extends Entity<AttachmentProps> {
  get title() {
    return this.props.title
  }

  get url() {
    return this.props.url
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(
    props: Omit<AttachmentProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityId,
  ) {
    return new Attachment(
      {
        ...props,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id,
    )
  }
}
