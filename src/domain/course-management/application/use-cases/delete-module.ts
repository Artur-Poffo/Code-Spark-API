import { left, right, type Either } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Module } from '../../enterprise/entities/module'
import { type CoursesRepository } from './../repositories/courses-repository'
import { type ModulesRepository } from './../repositories/modules-repository'

interface DeleteModuleUseCaseRequest {
  moduleId: string
  instructorId: string
}

type DeleteModuleUseCaseResponse = Either<
ResourceNotFoundError | NotAllowedError,
{
  module: Module
}
>

export class DeleteModuleUseCase implements UseCase<DeleteModuleUseCaseRequest, DeleteModuleUseCaseResponse> {
  constructor(
    private readonly modulesRepository: ModulesRepository,
    private readonly coursesRepository: CoursesRepository
  ) { }

  async exec({
    moduleId,
    instructorId
  }: DeleteModuleUseCaseRequest): Promise<DeleteModuleUseCaseResponse> {
    const module = await this.modulesRepository.findById(moduleId)

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

    await this.modulesRepository.delete(module)

    return right({
      module
    })
  }
}
