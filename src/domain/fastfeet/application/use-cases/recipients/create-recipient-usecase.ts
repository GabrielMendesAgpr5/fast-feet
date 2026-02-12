import { Either, right } from '@/core/either'
import { ConflictError } from '@/core/errors/use-case-errors/conflict-error'
import { Recipient } from '@/domain/fastfeet/enterprise/entities/recipient'
import { IRecipientsRepository } from '../../repositories/recipients-repository'
import { Coordinates } from '@/domain/fastfeet/enterprise/value-objects/coordinates'

interface ICreateRecipientDTO {
  id: string
  name: string
  email: string
  street: string
  city: string
  state: string
  complement: string
  number: string
  zipCode: string
  latitude: number
  longitude: number
}

type CreateRecipientResponseUseCase = Either<
  ConflictError,
  {
    recipient: Recipient
  }
>

export class CreateRecipientUseCase {
  constructor(private recipientRepository: IRecipientsRepository) {}

  async execute(
    data: ICreateRecipientDTO,
  ): Promise<CreateRecipientResponseUseCase> {
    const coordinates = Coordinates.create(data.latitude, data.longitude)
    const recipient = Recipient.create(...data, coordinates)

    await this.recipientRepository.create(recipient)
    return right({ recipient })
  }
}
