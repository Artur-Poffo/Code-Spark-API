import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Module } from '../../enterprise/entities/module'
import { type ModulesRepository } from './../repositories/modules-repository'
import { ModuleNumberIsAlreadyInUseError } from './errors/module-number-already-in-use-error'

interface EditModuleDetailsUseCaseRequest {
  name?: string
  description?: string
  moduleNumber?: number
  moduleId: string
}

type EditModuleDetailsUseCaseResponse = Either<
ResourceNotFoundError | ModuleNumberIsAlreadyInUseError,
{
  module: Module
}
>

export class EditModuleDetailsUseCase implements UseCase<EditModuleDetailsUseCaseRequest, EditModuleDetailsUseCaseResponse> {
  constructor(
    private readonly modulesRepository: ModulesRepository
  ) { }

  async exec({
    name,
    description,
    moduleNumber,
    moduleId
  }: EditModuleDetailsUseCaseRequest): Promise<EditModuleDetailsUseCaseResponse> {
    const module = await this.modulesRepository.findById(moduleId)

    if (!module) {
      return left(new ResourceNotFoundError())
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
