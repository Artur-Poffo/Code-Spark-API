import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type InstructorProps } from '../../enterprise/entities/instructor'
import { type StudentProps } from '../../enterprise/entities/student'
import { type User } from '../../enterprise/entities/user'
import { type UsersRepository } from './../repositories/users-repository'

interface DeleteUserUseCaseRequest {
  userId: string
}

type DeleteUserUseCaseResponse = Either<
ResourceNotFoundError,
{
  user: User<StudentProps | InstructorProps>
}
>

export class DeleteUserUseCase implements UseCase<DeleteUserUseCaseRequest, DeleteUserUseCaseResponse> {
  constructor(
    private readonly usersRepository: UsersRepository
  ) { }

  async exec({
    userId
  }: DeleteUserUseCaseRequest): Promise<DeleteUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    await this.usersRepository.delete(user)

    return right({
      user
    })
  }
}
