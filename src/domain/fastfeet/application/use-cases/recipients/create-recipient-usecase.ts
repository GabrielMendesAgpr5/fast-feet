// src/domain/fastfeet/application/use-cases/recipients/create-recipient-usecase.ts
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Recipient } from '@/domain/fastfeet/enterprise/entities/recipient'
import { IRecipientsRepository } from '../../repositories/recipients-repository'
import { Coordinates } from '@/domain/fastfeet/enterprise/value-objects/coordinates'
import { GeocodingService } from '../../geolocation/geocoding-service'
import { GeocodingFailedError } from '@/core/errors/use-case-errors/geocoding-error'

export interface ICreateRecipientDTO {
  name: string
  email: string | null
  street: string
  city: string
  state: string
  complement: string | null
  number: string
  zipCode: string
  latitude?: number
  longitude?: number
}

type CreateRecipientResponseUseCase = Either<
  GeocodingFailedError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class CreateRecipientUseCase {
  constructor(
    private readonly recipientRepository: IRecipientsRepository,
    private readonly geocodingService: GeocodingService,
  ) {}

  async execute(
    data: ICreateRecipientDTO,
  ): Promise<CreateRecipientResponseUseCase> {
    // Resolve coordenadas (manual ou via API)
    const coordinates = await this.resolveCoordinates(data)

    if (!coordinates) {
      const fullAddress = this.buildFullAddress(data)
      return left(new GeocodingFailedError(fullAddress))
    }

    // Cria o recipient
    const recipient = Recipient.create({
      name: data.name,
      email: data.email,
      street: data.street,
      number: data.number,
      complement: data.complement,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      coordinates,
    })

    await this.recipientRepository.create(recipient)
    return right({ recipient })
  }

  private async resolveCoordinates(
    data: ICreateRecipientDTO,
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

  private hasManualCoordinates(data: ICreateRecipientDTO): boolean {
    return (
      data.latitude !== undefined &&
      data.longitude !== undefined &&
      !isNaN(data.latitude) &&
      !isNaN(data.longitude)
    )
  }

  private buildFullAddress(data: ICreateRecipientDTO): string {
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
