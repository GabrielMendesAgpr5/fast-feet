import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export enum UserRoleEnum {
  ADMIN = 'ADMIN',
  DELIVERYMAN = 'DELIVERYMAN',
}

export interface UserProps {
  name: string
  cpf: string
  password: string
  role: UserRoleEnum
  createdAt?: Date
  updatedAt?: Date
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name
  }
  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get cpf() {
    return this.props.cpf
  }

  get password() {
    return this.props.password
  }
  set password(password: string) {
    this.props.password = password
    this.touch()
  }

  get role() {
    return this.props.role
  }
  set role(role: UserRoleEnum) {
    this.props.role = role
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
    props: Omit<UserProps, 'createdAt' | 'updatedAt'> & {
      createdAt?: Date
      updatedAt?: Date
    },
    id?: UniqueEntityId,
  ) {
    const now = new Date()
    return new User(
      {
        ...props,
        createdAt: props.createdAt ?? now,
        updatedAt: props.updatedAt ?? now,
      },
      id,
    )
  }

  isDeliveryman(): boolean {
    return this.props.role === UserRoleEnum.DELIVERYMAN
  }

  isAdmin(): boolean {
    return this.props.role === UserRoleEnum.ADMIN
  }
}
