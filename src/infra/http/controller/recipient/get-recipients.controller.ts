import {
  Controller,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { Roles } from '@/infra/auth/roles.decorator'
import { UserRoleEnum } from '@/domain/fastfeet/enterprise/entities/user'
import { GetRecipientsUseCase } from '@/domain/fastfeet/application/use-cases/recipients/get-recipient'
import {
  validateGetRecipientsDTO,
  type GetRecipientsQueryDTO,
  GetRecipientsSwaggerDTO,
} from './dto/GetRecipientsDTO'

@ApiBearerAuth('bearer')
@ApiTags('recipient')
@Controller('/recipient')
export class GetRecipientsController {
  constructor(private readonly getRecipientsUseCase: GetRecipientsUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiOperation({ summary: 'Get recipients (Admin Only)' })
  @ApiQuery({ name: 'filters', type: GetRecipientsSwaggerDTO })
  @HttpCode(HttpStatus.OK)
  async handle(
    @Query(validateGetRecipientsDTO) filters: GetRecipientsQueryDTO,
  ) {
    const result = await this.getRecipientsUseCase.execute(filters)
    const { recipients } = result.value

    return {
      recipients: recipients.map((recipient) => ({
        id: recipient.id.toString(),
        name: recipient.name,
        email: recipient.email,
        city: recipient.city,
        street: recipient.street,
        state: recipient.state,
        zipCode: recipient.zipCode,
        updatedAt: recipient.updatedAt,
        createdAt: recipient.createdAt,
      })),
    }
  }
}
