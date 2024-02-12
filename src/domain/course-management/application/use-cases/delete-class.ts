import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Class } from '../../enterprise/entities/class'
import { type ClassesRepository } from './../repositories/classes-repository'

interface DeleteClassUseCaseRequest {
  classId: string
}

type DeleteClassUseCaseResponse = Either<
ResourceNotFoundError,
{
  class: Class
}
>

export class DeleteClassUseCase implements UseCase<DeleteClassUseCaseRequest, DeleteClassUseCaseResponse> {
  constructor(
    private readonly classesRepository: ClassesRepository
  ) { }

  async exec({
    classId
  }: DeleteClassUseCaseRequest): Promise<DeleteClassUseCaseResponse> {
    const classToDelete = await this.classesRepository.findById(classId)

    if (!classToDelete) {
      return left(new ResourceNotFoundError())
    }

    await this.classesRepository.delete(classToDelete)

    return right({
      class: classToDelete
    })
  }
}
