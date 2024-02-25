import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { type UseCase } from '@/core/use-cases/use-case'
import { type Module } from '../../enterprise/entities/module'
import { type ModulesRepository } from '../repositories/modules-repository'

interface GetModuleDetailsUseCaseRequest {
  moduleId: string
}

type GetModuleDetailsUseCaseResponse = Either<
ResourceNotFoundError,
{
  module: Module
}
>

export class GetModuleDetailsUseCase implements UseCase<GetModuleDetailsUseCaseRequest, GetModuleDetailsUseCaseResponse> {
  constructor(
    private readonly modulesRepository: ModulesRepository
  ) { }

  async exec({
    moduleId
  }: GetModuleDetailsUseCaseRequest): Promise<GetModuleDetailsUseCaseResponse> {
    const module = await this.modulesRepository.findById(moduleId)

    if (!module) {
      return left(new ResourceNotFoundError())
    }

    return right({
      module
    })
  }
}
