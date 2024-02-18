import { DeleteModuleUseCase } from '@/domain/course-management/application/use-cases/delete-module'
import { makePrismaCoursesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-courses-repository'
import { makePrismaModulesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-modules-repository'

export function makeDeleteModuleUseCase() {
  const prismaModulesRepository = makePrismaModulesRepository()
  const prismaCoursesRepository = makePrismaCoursesRepository()

  const deleteModuleUseCase = new DeleteModuleUseCase(
    prismaModulesRepository,
    prismaCoursesRepository
  )

  return deleteModuleUseCase
}
