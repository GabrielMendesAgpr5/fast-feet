import { Recipient } from '@/domain/fastfeet/enterprise/entities/recipient'
import { ApiProperty } from '@nestjs/swagger'

export class RecipientPresenterResponse {
  @ApiProperty()
  id!: string
  @ApiProperty()
  name!: string
  @ApiProperty()
  email!: string | null
  @ApiProperty()
  street!: string
  @ApiProperty()
  number!: string
  @ApiProperty()
  complement!: string | null
  @ApiProperty()
  city!: string
  @ApiProperty()
  state!: string
  @ApiProperty()
  zipCode!: string
  @ApiProperty()
  latitude!: number
  @ApiProperty()
  longitude!: number
}

export class RecipientPresenter {
  static toHTTP(recipient: Recipient): RecipientPresenterResponse {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      email: recipient.email,
      street: recipient.street,
      number: recipient.number,
      complement: recipient.complement,
      city: recipient.city,
      state: recipient.state,
      zipCode: recipient.zipCode,
      latitude: recipient.latitude,
      longitude: recipient.longitude,
    }
  }
}
