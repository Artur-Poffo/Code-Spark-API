import { EditModuleDetailsUseCase } from '@/domain/course-management/application/use-cases/edit-module-details'
import { makePrismaCoursesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-courses-repository'
import { makePrismaModulesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-modules-repository'

export function makeEditModuleDetailsUseCase() {
  const prismaModulesRepository = makePrismaModulesRepository()
  const prismaCoursesRepository = makePrismaCoursesRepository()

  const editModuleDetailsUseCase = new EditModuleDetailsUseCase(
    prismaModulesRepository,
    prismaCoursesRepository
  )

  return editModuleDetailsUseCase
}
