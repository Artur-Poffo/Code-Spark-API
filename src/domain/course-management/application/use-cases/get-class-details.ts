import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Class } from '../../enterprise/entities/class'
import { type ClassesRepository } from '../repositories/classes-repository'

interface GetClassDetailsUseCaseRequest {
  classId: string
}

type GetClassDetailsUseCaseResponse = Either<
ResourceNotFoundError,
{
  class: Class
}
>

export class GetClassDetailsUseCase implements UseCase<GetClassDetailsUseCaseRequest, GetClassDetailsUseCaseResponse> {
  constructor(
    private readonly classesRepository: ClassesRepository
  ) { }

  async exec({
    classId
  }: GetClassDetailsUseCaseRequest): Promise<GetClassDetailsUseCaseResponse> {
    const classToFind = await this.classesRepository.findById(classId)

    if (!classToFind) {
      return left(new ResourceNotFoundError())
    }

    return right({
      class: classToFind
    })
  }
}
