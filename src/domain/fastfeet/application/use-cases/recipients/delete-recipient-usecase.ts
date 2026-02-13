import { Either, left, right } from '@/core/either'
import { NotFoundError } from '@/core/errors/use-case-errors/not-found-error'
import { Injectable } from '@nestjs/common'
import { IRecipientsRepository } from '../../repositories/recipients-repository'
import { IOrdersRepository } from '../../repositories/orders-repository'
import { ConflictError } from '@/core/errors/use-case-errors/conflict-error'

export interface IDeleteRecipientDTO {
  Id: string
}

type DeleteRecipientResponseUseCase = Either<
  NotFoundError | ConflictError,
  null
>

@Injectable()
export class DeleteRecipientUseCase {
  constructor(
    private recipientsRepository: IRecipientsRepository,
    private ordersRepository: IOrdersRepository,
  ) {}

  async execute(
    data: IDeleteRecipientDTO,
  ): Promise<DeleteRecipientResponseUseCase> {
    const recipient = await this.recipientsRepository.findById(data.Id)
    if (!recipient) return left(new NotFoundError('Recipient not found'))

    const usingOnOrderRecipient = await this.ordersRepository.findByRecipient(
      data.Id,
    )
    if (usingOnOrderRecipient)
      return left(new ConflictError('Recipient on Order'))

    await this.recipientsRepository.delete(recipient.id.toString())

    return right(null)
  }
}
