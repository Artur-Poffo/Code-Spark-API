import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { InstructorProps } from '../../enterprise/entities/instructor'
import { StudentProps } from '../../enterprise/entities/student'
import { User } from '../../enterprise/entities/user'
import { type UsersRepository } from './../repositories/users-repository'

interface GetUserInfoUseCaseRequest {
  id: string
}

type GetUserInfoUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    user: User<StudentProps | InstructorProps>
  }
>

export class GetUserInfoUseCase implements UseCase<GetUserInfoUseCaseRequest, GetUserInfoUseCaseResponse> {
  constructor(
    private readonly usersRepository: UsersRepository,
  ) { }

  async exec({
    id
  }: GetUserInfoUseCaseRequest): Promise<GetUserInfoUseCaseResponse> {
    const user = await this.usersRepository.findById(id)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    return right({
      user
    })
  }
}
