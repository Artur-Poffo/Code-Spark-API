import { FetchModuleClassesUseCase } from '@/domain/course-management/application/use-cases/fetch-module-classes'
import { makePrismaClassesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-classes-repository'
import { makePrismaModulesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-modules-repository'

export function makeFetchModuleClassesUseCase() {
  const prismaClassesRepository = makePrismaClassesRepository()
  const prismaModulesRepository = makePrismaModulesRepository()

  const fetchModuleClassesUseCase = new FetchModuleClassesUseCase(
    prismaModulesRepository,
    prismaClassesRepository
  )

  return fetchModuleClassesUseCase
}
