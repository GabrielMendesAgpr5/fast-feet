import { Either, left, right } from '@/core/either'
import { NotFoundError } from '@/core/errors/use-case-errors/not-found-error'
import { Injectable } from '@nestjs/common'
import { IRecipientsRepository } from '../../repositories/recipients-repository'
import { Recipient } from '@/domain/fastfeet/enterprise/entities/recipient'

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
  constructor(private recipientRepository: IRecipientsRepository) {}

  async execute(
    data: IUpdateRecipientDTO,
  ): Promise<UpdateRecipientResponseUseCase> {
    const recipient = await this.recipientRepository.findById(data.id)
    if (!recipient) return left(new NotFoundError('Recipient not found'))

    let latLonChange = false

    if (data.email !== undefined) recipient.email = data.email
    if (data.name !== undefined) recipient.name = data.name
    if (data.number !== undefined) recipient.number = data.number
    if (data.complement !== undefined) recipient.complement = data.complement

    if (data.city !== undefined) {
      recipient.city = data.city
      latLonChange = true
    }

    if (data.state !== undefined) {
      recipient.state = data.state
      latLonChange = true
    }

    if (data.street !== undefined) {
      recipient.street = data.street
      latLonChange = true
    }

    if (data.zipCode !== undefined) {
      recipient.zipCode = data.zipCode
      latLonChange = true
    }

    if (data.latitude !== undefined || data.longitude !== undefined) {
      //ajusta latitude e longitude
      latLonChange = false
    }

    if (latLonChange) {
      //ajusta latitude e longitude
    }

    await this.recipientRepository.update(recipient)
    return right({ recipient })
  }
}
