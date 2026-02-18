import { Module } from '@nestjs/common'
import { DataBaseModule } from '@/infra/database/database.module'
import { EnvModule } from '@/infra/env/env.module'
import { CreateRecipientController } from './create-recipient.controller'
import { CreateRecipientUseCase } from '@/domain/fastfeet/application/use-cases/recipients/create-recipient-usecase'
import { DeleteRecipientController } from './delete-recipient.controller'
import { DeleteRecipientUseCase } from '@/domain/fastfeet/application/use-cases/recipients/delete-recipient-usecase'
import { GeolocationModule } from '../../geolocation/geolocation.module'
import { UpdateRecipientController } from './update-recipient.controller'
import { UpdateRecipientUseCase } from '@/domain/fastfeet/application/use-cases/recipients/update-recipient-usecase'
import { GetRecipientsController } from './get-recipients.controller'
import { GetRecipientsUseCase } from '@/domain/fastfeet/application/use-cases/recipients/get-recipient'

@Module({
  imports: [DataBaseModule, EnvModule, GeolocationModule],
  controllers: [
    CreateRecipientController,
    UpdateRecipientController,
    DeleteRecipientController,
    GetRecipientsController,
  ],
  providers: [
    CreateRecipientUseCase,
    UpdateRecipientUseCase,
    DeleteRecipientUseCase,
    GetRecipientsUseCase,
  ],
})
export class RecipientModule {}
