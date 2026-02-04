import { Either, left, right } from '@/core/either'
import { ConflictError } from '@/core/errors/use-case-errors/conflict-error'
import { NotAllowedError } from '@/core/errors/use-case-errors/not-allowed-error'
import { IUsersRepository } from '../../repositories/users-repository'
import { User, UserRoleEnum } from '@/domain/fastfeet/enterprise/entities/user'

export interface IDelivererDTO {
  name: string
  cpf: string
  password: string
}

type CreateDelivererResponseUseCase = Either<
  NotAllowedError | ConflictError,
  {
    user: User
  }
>

export class CreateDelivererUseCase {
  constructor(private readonly userRepository: IUsersRepository) {}

  async execute(data: IDelivererDTO): Promise<CreateDelivererResponseUseCase> {
    {
      const userAlreadyExists = await this.userRepository.findByCpf(data.cpf)
      if (userAlreadyExists) {
        return left(new ConflictError('This CPF is already in use'))
      }

      //TODO: Validação de senha

      const user = User.create({ ...data, role: UserRoleEnum.DELIVERYMAN })
      await this.userRepository.create(user)

      return right({ user })
    }
  }
}
