import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Coordinates } from '../value-objects/coordinates'

export interface RecipientProps {
  name: string
  email: string | null
  street: string
  number: string
  complement: string | null
  city: string
  state: string
  zipCode: string
  coordinates: Coordinates
  createdAt?: Date
  updatedAt?: Date
}

export class Recipient extends Entity<RecipientProps> {
  get name() {
    return this.props.name
  }

  set name(value: string) {
    this.props.name = value
    this.touch()
  }

  get email() {
    return this.props.email
  }

  set email(value: string | null) {
    this.props.email = value
    this.touch()
  }

  get street() {
    return this.props.street
  }

  set street(value: string) {
    this.props.street = value
    this.touch()
  }

  get number() {
    return this.props.number
  }

  set number(value: string) {
    this.props.number = value
    this.touch()
  }

  get complement() {
    return this.props.complement
  }

  set complement(value: string | null) {
    this.props.complement = value
    this.touch()
  }

  get city() {
    return this.props.city
  }

  set city(value: string) {
    this.props.city = value
    this.touch()
  }

  get state() {
    return this.props.state
  }

  set state(value: string) {
    this.props.state = value
    this.touch()
  }

  get zipCode() {
    return this.props.zipCode
  }

  set zipCode(value: string) {
    this.props.zipCode = value
    this.touch()
  }

  get coordinates() {
    return this.props.coordinates
  }

  set coordinates(value: Coordinates) {
    this.props.coordinates = value
    this.touch()
  }

  get latitude() {
    return this.props.coordinates.latitude
  }

  get longitude() {
    return this.props.coordinates.longitude
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

  updateCoordinates(latitude: number, longitude: number): void {
    this.props.coordinates = Coordinates.create(latitude, longitude)
    this.touch()
  }

  static create(
    props: Omit<RecipientProps, 'createdAt' | 'updatedAt'> & {
      createdAt?: Date
      updatedAt?: Date
    },
    id?: UniqueEntityId,
  ) {
    const now = new Date()
    return new Recipient(
      {
        ...props,
        createdAt: props.createdAt ?? now,
        updatedAt: props.updatedAt ?? now,
      },
      id,
    )
  }
}
