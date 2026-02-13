import { Module } from '@nestjs/common'
import { DataBaseModule } from '@/infra/database/database.module'
import { EnvModule } from '@/infra/env/env.module'
import { CreateRecipientController } from '../recipient/create-recipient.controller'
import { CreateRecipientUseCase } from '@/domain/fastfeet/application/use-cases/recipients/create-recipient-usecase'
import { DeleteRecipientController } from './delete-recipient.controller'
import { DeleteRecipientUseCase } from '@/domain/fastfeet/application/use-cases/recipients/delete-recipient-usecase'
import { GeolocationModule } from '../geolocation/geolocation.module'

@Module({
  imports: [DataBaseModule, EnvModule, GeolocationModule],
  controllers: [CreateRecipientController, DeleteRecipientController],
  providers: [CreateRecipientUseCase, DeleteRecipientUseCase],
})
export class RecipientModule {}
