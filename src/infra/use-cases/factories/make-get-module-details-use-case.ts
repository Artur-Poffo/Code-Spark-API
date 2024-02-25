import { GetModuleDetailsUseCase } from '@/domain/course-management/application/use-cases/get-module-details'
import { makePrismaModulesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-modules-repository'

export function makeGetModuleDetailsUseCase() {
  const prismaModulesRepository = makePrismaModulesRepository()

  const getModuleDetailsUseCase = new GetModuleDetailsUseCase(
    prismaModulesRepository
  )

  return getModuleDetailsUseCase
}
