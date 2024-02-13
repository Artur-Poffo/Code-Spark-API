import { left, right, type Either } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Module } from '../../enterprise/entities/module'
import { type CoursesRepository } from '../repositories/courses-repository'
import { type ModulesRepository } from './../repositories/modules-repository'
import { ModuleNumberIsAlreadyInUseError } from './errors/module-number-already-in-use-error'

interface EditModuleDetailsUseCaseRequest {
  name?: string
  description?: string
  moduleNumber?: number
  moduleId: string
  instructorId: string
}

type EditModuleDetailsUseCaseResponse = Either<
ResourceNotFoundError | NotAllowedError | ModuleNumberIsAlreadyInUseError,
{
  module: Module
}
>

export class EditModuleDetailsUseCase implements UseCase<EditModuleDetailsUseCaseRequest, EditModuleDetailsUseCaseResponse> {
  constructor(
    private readonly modulesRepository: ModulesRepository,
    private readonly coursesRepository: CoursesRepository
  ) { }

  async exec({
    name,
    description,
    moduleNumber,
    moduleId,
    instructorId
  }: EditModuleDetailsUseCaseRequest): Promise<EditModuleDetailsUseCaseResponse> {
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

    module.name = name ?? module.name
    module.description = description ?? module.description

    if (moduleNumber) {
      const courseModules = await this.modulesRepository.findManyByCourseId(module.courseId.toString())
      const moduleWithSameNumber = courseModules.find(moduleToCompare => moduleToCompare.moduleNumber === moduleNumber)

      if (moduleWithSameNumber) {
        return left(new ModuleNumberIsAlreadyInUseError(moduleNumber))
      }
    }

    module.moduleNumber = moduleNumber ?? module.moduleNumber

    await this.modulesRepository.save(module)

    return right({
      module
    })
  }
}
