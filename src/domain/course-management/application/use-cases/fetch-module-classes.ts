import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Class } from '../../enterprise/entities/class'
import { type ClassesRepository } from '../repositories/classes-repository'
import { type ModulesRepository } from '../repositories/modules-repository'

interface FetchModuleClassesUseCaseRequest {
  moduleId: string
}

type FetchModuleClassesUseCaseResponse = Either<
ResourceNotFoundError,
{
  classes: Class[]
}
>

export class FetchModuleClassesUseCase implements UseCase<FetchModuleClassesUseCaseRequest, FetchModuleClassesUseCaseResponse> {
  constructor(
    private readonly modulesRepository: ModulesRepository,
    private readonly classesRepository: ClassesRepository
  ) { }

  async exec({
    moduleId
  }: FetchModuleClassesUseCaseRequest): Promise<FetchModuleClassesUseCaseResponse> {
    const module = await this.modulesRepository.findById(moduleId)

    if (!module) {
      return left(new ResourceNotFoundError())
    }

    const moduleClasses = await this.classesRepository.findManyByModuleId(moduleId)

    return right({
      classes: moduleClasses
    })
  }
}
