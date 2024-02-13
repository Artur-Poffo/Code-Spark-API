import { left, right, type Either } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Class } from '../../enterprise/entities/class'
import { type ModulesRepository } from '../repositories/modules-repository'
import { type ClassesRepository } from './../repositories/classes-repository'
import { type CoursesRepository } from './../repositories/courses-repository'

interface DeleteClassUseCaseRequest {
  classId: string
  instructorId: string
}

type DeleteClassUseCaseResponse = Either<
ResourceNotFoundError | NotAllowedError,
{
  class: Class
}
>

export class DeleteClassUseCase implements UseCase<DeleteClassUseCaseRequest, DeleteClassUseCaseResponse> {
  constructor(
    private readonly classesRepository: ClassesRepository,
    private readonly modulesRepository: ModulesRepository,
    private readonly coursesRepository: CoursesRepository
  ) { }

  async exec({
    classId,
    instructorId
  }: DeleteClassUseCaseRequest): Promise<DeleteClassUseCaseResponse> {
    const classToDelete = await this.classesRepository.findById(classId)

    if (!classToDelete) {
      return left(new ResourceNotFoundError())
    }

    const module = await this.modulesRepository.findById(classToDelete.moduleId.toString())

    if (!module) {
      return left(new ResourceNotFoundError())
    }

    const course = await this.coursesRepository.findById(module.courseId.toString())

    if (!course) {
      return left(new ResourceNotFoundError())
    }

    const instructorIsTheOwner = course.instructorId.toString() === instructorId

    if (!instructorIsTheOwner) {
      return left(new NotAllowedError())
    }

    await this.classesRepository.delete(classToDelete)

    return right({
      class: classToDelete
    })
  }
}
