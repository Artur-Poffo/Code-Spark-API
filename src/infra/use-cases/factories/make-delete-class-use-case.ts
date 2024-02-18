import { DeleteClassUseCase } from '@/domain/course-management/application/use-cases/delete-class'
import { makePrismaClassesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-classes-repository'
import { makePrismaCoursesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-courses-repository'
import { makePrismaModulesRepository } from '@/infra/database/prisma/repositories/factories/make-prisma-modules-repository'

export function makeDeleteClassUseCase() {
  const prismaClassesRepository = makePrismaClassesRepository()
  const prismaModulesRepository = makePrismaModulesRepository()
  const prismaCoursesRepository = makePrismaCoursesRepository()

  const deleteClassUseCase = new DeleteClassUseCase(
    prismaClassesRepository,
    prismaModulesRepository,
    prismaCoursesRepository
  )

  return deleteClassUseCase
}
