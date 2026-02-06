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
  createdAt: Date
  updatedAt?: Date
}

export class User {
  private readonly _id: UniqueEntityId
  private props: UserProps

  get id() {
    return this._id
  }

  get name() {
    return this.props.name
  }
  set name(value: string) {
    this.props.name = value
    this.touch()
  }

  get cpf() {
    return this.props.cpf
  }
  set cpf(value: string) {
    this.props.cpf = value
    this.touch()
  }

  get password() {
    return this.props.password
  }
  set password(value: string) {
    this.props.password = value
    this.touch()
  }

  get role() {
    return this.props.role
  }
  set role(value: UserRoleEnum) {
    this.props.role = value
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

  private constructor(props: UserProps, id?: UniqueEntityId) {
    this._id = id ?? new UniqueEntityId()
    this.props = props
  }

  // Método para CRIAR novos usuários
  static create(
    props: Omit<UserProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityId,
  ) {
    const now = new Date()
    return new User(
      {
        ...props,
        createdAt: now,
        updatedAt: now,
      },
      id,
    )
  }

  static reconstitute(props: UserProps, id: UniqueEntityId) {
    return new User(props, id)
  }

  static isAdmin(role: UserRoleEnum): boolean {
    return role === UserRoleEnum.ADMIN
  }

  static isDeliveryman(role: UserRoleEnum): boolean {
    return role === UserRoleEnum.DELIVERYMAN
  }
}
