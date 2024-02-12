import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Module } from '../../enterprise/entities/module'
import { type ModulesRepository } from './../repositories/modules-repository'

interface DeleteModuleUseCaseRequest {
  moduleId: string
}

type DeleteModuleUseCaseResponse = Either<
ResourceNotFoundError,
{
  module: Module
}
>

export class DeleteModuleUseCase implements UseCase<DeleteModuleUseCaseRequest, DeleteModuleUseCaseResponse> {
  constructor(
    private readonly modulesRepository: ModulesRepository
  ) { }

  async exec({
    moduleId
  }: DeleteModuleUseCaseRequest): Promise<DeleteModuleUseCaseResponse> {
    const module = await this.modulesRepository.findById(moduleId)

    if (!module) {
      return left(new ResourceNotFoundError())
    }

    await this.modulesRepository.delete(module)

    return right({
      module
    })
  }
}
