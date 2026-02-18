import { Either, left, right } from '@/core/either'
import { NotFoundError } from '@/core/errors/use-case-errors/not-found-error'
import { Injectable } from '@nestjs/common'
import { IRecipientsRepository } from '../../repositories/recipients-repository'
import { Recipient } from '@/domain/fastfeet/enterprise/entities/recipient'
import { GeocodingService } from '../../geolocation/geocoding-service'
import { Coordinates } from '@/domain/fastfeet/enterprise/value-objects/coordinates'
import { GeocodingFailedError } from '@/core/errors/use-case-errors/geocoding-error'

export interface IUpdateRecipientDTO {
  id: string
  city?: string
  complement?: string
  email?: string
  latitude?: number
  longitude?: number
  name?: string
  number?: string
  state?: string
  street?: string
  zipCode?: string
}

type UpdateRecipientResponseUseCase = Either<
  NotFoundError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class UpdateRecipientUseCase {
  constructor(
    private recipientRepository: IRecipientsRepository,
    private readonly geocodingService: GeocodingService,
  ) {}

  async execute(
    data: IUpdateRecipientDTO,
  ): Promise<UpdateRecipientResponseUseCase> {
    const recipient = await this.recipientRepository.findById(data.id)
    if (!recipient) return left(new NotFoundError('Recipient not found'))

    let shouldUpdateCoordinates = false

    if (data.email !== undefined) recipient.email = data.email
    if (data.name !== undefined) recipient.name = data.name
    if (data.number !== undefined) recipient.number = data.number
    if (data.complement !== undefined) recipient.complement = data.complement

    if (data.city !== undefined) {
      recipient.city = data.city
      shouldUpdateCoordinates = true
    }

    if (data.state !== undefined) {
      recipient.state = data.state
      shouldUpdateCoordinates = true
    }

    if (data.street !== undefined) {
      recipient.street = data.street
      shouldUpdateCoordinates = true
    }

    if (data.zipCode !== undefined) {
      recipient.zipCode = data.zipCode
      shouldUpdateCoordinates = true
    }

    if (this.hasManualCoordinates(data)) {
      recipient.updateCoordinates(data.latitude!, data.longitude!)
      shouldUpdateCoordinates = false
    }

    if (shouldUpdateCoordinates) {
      const coordinates = await this.resolveCoordinates({
        ...data,
        street: recipient.street,
        city: recipient.city,
        state: recipient.state,
        zipCode: recipient.zipCode,
      })

      if (!coordinates) {
        const fullAddress = this.buildFullAddress(data)
        return left(new GeocodingFailedError(fullAddress))
      }

      recipient.updateCoordinates(coordinates.latitude, coordinates.longitude)
    }

    await this.recipientRepository.update(recipient)

    return right({ recipient })
  }

  private async resolveCoordinates(
    data: IUpdateRecipientDTO,
  ): Promise<Coordinates | null> {
    // Se já forneceu coordenadas manualmente
    if (this.hasManualCoordinates(data)) {
      return Coordinates.create(data.latitude!, data.longitude!)
    }

    // Busca via API de geocoding
    const fullAddress = this.buildFullAddress(data)
    const geocodeResult = await this.geocodingService.geocode(fullAddress)

    if (!geocodeResult) {
      return null
    }

    return Coordinates.create(geocodeResult.latitude, geocodeResult.longitude)
  }

  private hasManualCoordinates(data: IUpdateRecipientDTO): boolean {
    return (
      data.latitude !== undefined &&
      data.longitude !== undefined &&
      !isNaN(data.latitude) &&
      !isNaN(data.longitude)
    )
  }

  private buildFullAddress(data: IUpdateRecipientDTO): string {
    const addressParts = [
      data.street,
      data.city,
      data.state,
      data.zipCode,
      'Brazil',
    ]

    return addressParts.filter(Boolean).join(', ')
  }
}
