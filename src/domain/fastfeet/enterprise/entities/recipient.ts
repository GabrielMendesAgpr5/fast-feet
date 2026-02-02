export interface RecipientProps {
  name: string
  email: string | null
  street: string
  number: string
  complement: string | null
  city: string
  state: string
  zipCode: string
  latitude: number
  longitude: number
  createdAt: Date
  updatedAt: Date
}

export class Recipient {
  private readonly _id: string
  private props: RecipientProps
  private constructor(props: RecipientProps, id?: string) {
    this._id = id ?? crypto.randomUUID()
    this.props = props
  }

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

  get latitude() {
    return this.props.latitude
  }

  set latitude(value: number) {
    this.props.latitude = value
    this.touch()
  }

  get longitude() {
    return this.props.longitude
  }

  set longitude(value: number) {
    this.props.longitude = value
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
    props: Omit<RecipientProps, 'createdAt' | 'updatedAt'>,
    id?: string,
  ) {
    const now = new Date()
    return new Recipient(
      {
        ...props,
        createdAt: now,
        updatedAt: now,
      },
      id,
    )
  }
}
