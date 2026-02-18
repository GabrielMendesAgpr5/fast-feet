import {
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  UseGuards,
  Get,
  UsePipes,
  Query,
  ValidationPipe,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { RolesGuard } from '@/infra/auth/roles.guard'
import { Roles } from '@/infra/auth/roles.decorator'
import { UserRoleEnum } from '@/domain/fastfeet/enterprise/entities/user'
import { GetUsersByRoleUseCase } from '@/domain/fastfeet/application/use-cases/users/get-user-by-role-usecase'
import {
  GetUsersByRoleQueryDTO,
  validateGetUsersByRoleDTO,
} from './dto/GetUsersByRoleDTO'

@ApiBearerAuth('bearer')
@ApiTags('user')
@Controller('/user')
export class GetUsersByRoleController {
  constructor(private readonly getUsersByRoleUseCase: GetUsersByRoleUseCase) {}

  @Get()
  @UsePipes(validateGetUsersByRoleDTO)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @ApiOperation({ summary: 'Get users by role(optional) (Admin Only)' })
  @HttpCode(HttpStatus.OK)
  async handle(
    @Query(new ValidationPipe({ transform: true }))
    query: GetUsersByRoleQueryDTO,
  ) {
    const result = await this.getUsersByRoleUseCase.execute({
      role: query.role,
    })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    const { users } = result.value

    return {
      orders: users.map((user) => ({
        id: user.id.toString(),
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      })),
    }
  }
}
