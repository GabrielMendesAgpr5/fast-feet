import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { IRecipientsRepository } from '../../repositories/recipients-repository'
import { Recipient } from '@/domain/fastfeet/enterprise/entities/recipient'

export interface IGetRecipientsDTO {
  id?: string
  name?: string
  email?: string
  city?: string
  state?: string
}

type GetRecipientsResponseUseCase = Either<never, { recipients: Recipient[] }>

@Injectable()
export class GetRecipientsUseCase {
  constructor(private recipientRepository: IRecipientsRepository) {}

  async execute(
    filters: IGetRecipientsDTO,
  ): Promise<GetRecipientsResponseUseCase> {
    const recipients = await this.recipientRepository.findMany(filters)

    return right({ recipients })
  }
}
