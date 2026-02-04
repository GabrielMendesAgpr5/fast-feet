import { User } from '@/domain/fastfeet/enterprise/entities/user'

export abstract class IUsersRepository {
  abstract create(user: User): Promise<User>
  abstract update(user: User): Promise<User>
  abstract findByCpf(UserCpf: string): Promise<User | null>
  abstract findById(UserId: string): Promise<User | null>
}
